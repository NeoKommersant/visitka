import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import BottomMenu from './components/BottomMenu';
import backIcon from '/icons/back.png';
import forwardIcon from '/icons/forward.png';
import repeatIcon from '/icons/repeat.png';
import downIcon from '/icons/down.png';
export default function App() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [section, setSection] = useState(0);
  const [subSection, setSubSection] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  // рефы для хранения актуальных значений состояний внутри обработчиков (закрытия)
  const sectionRef = useRef(section);
  const subSectionRef = useRef(subSection);
  const teleportRef = useRef(false);
  const prevRef = useRef({ section: 0, sub: 0 });
  useEffect(() => {
    sectionRef.current = section;
    subSectionRef.current = subSection;
  }, [section, subSection]);
  // Эффект для назначения событий на контейнер (назначается один раз)
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const sectionsCount = 5;
    const subCounts = [0, 2, 1, 1, 0]; // предполагается, что для секций 4 и 5 нет подсекций
    const threshold = 50;
    const maxDrag = Math.min(vw, vh) / 2;
    let startX = 0, startY = 0, deltaX = 0, deltaY = 0;
    let moving = false, baseX = 0, baseY = 0;
    let isHorizontal = false, isVertical = false;
    const rubberband = (delta, limit) => {
      if (delta > limit) return limit + (delta - limit) * 0.15;
      if (delta < -limit) return -limit + (delta + limit) * 0.15;
      return delta;
    };
    const applyDrag = () => {
      const rX = isHorizontal ? rubberband(deltaX, maxDrag) : 0;
      const rY = isVertical ? rubberband(deltaY, maxDrag) : 0;
      const maxTiltY = 10;
      const foldFactor = 0.3;
      const angleY = isHorizontal
        ? (rX / maxDrag) * maxTiltY * (1 + (Math.abs(rX) / maxDrag) * foldFactor) * 0.15
        : 0;
      const brightness = 1 - Math.min(Math.abs(rX) / maxDrag * 0.5, 0.2) - Math.min(Math.abs(rY) / maxDrag * 0.5, 0.2);
      gsap.set(content, {
        x: baseX + rX,
        y: baseY + rY,
        rotationY: angleY,
        filter: `brightness(${brightness})`,
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });
    };
    const resetStyle = () => {
      gsap.to(content, {
        rotationX: 0,
        rotationY: 0,
        filter: 'brightness(1)',
        duration: 0.5,
        ease: 'power2.out',
      });
    };
    const onTouchStart = (e) => {
      moving = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      deltaX = 0;
      deltaY = 0;
      isHorizontal = false;
      isVertical = false;
      baseX = -sectionRef.current * vw;
      baseY = -subSectionRef.current * vh;
      gsap.killTweensOf(content);
    };
    const onTouchMove = (e) => {
      if (!moving) return;
      const dx = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
      const dy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
      if (!isHorizontal && !isVertical) {
        if (Math.abs(dx) > Math.abs(dy)) isHorizontal = true;
        else isVertical = true;
      }
      if (isHorizontal) {
        const canLeft = sectionRef.current < sectionsCount - 1;
        const canRight = sectionRef.current > 0;
        if ((dx < 0 && !canLeft) || (dx > 0 && !canRight)) return;
        deltaX = dx;
      }
      if (isVertical) {
        const maxSub = subCounts[sectionRef.current] || 0;
        const canDown = subSectionRef.current < maxSub;
        const canUp = subSectionRef.current > 0;
        if ((dy < 0 && !canDown) || (dy > 0 && !canUp)) return;
        deltaY = dy;
      }
      applyDrag();
    };
    const onTouchEnd = () => {
      moving = false;
      let newSec = sectionRef.current;
      let newSub = subSectionRef.current;
      let horizSwipe = false;
      if (isHorizontal && Math.abs(deltaX) > threshold) {
        horizSwipe = true;
        if (deltaX < 0 && sectionRef.current < sectionsCount - 1) newSec = sectionRef.current + 1;
        else if (deltaX > 0 && sectionRef.current > 0) newSec = sectionRef.current - 1;
        newSub = 0;
      } else if (isVertical && Math.abs(deltaY) > threshold) {
        const maxSub = subCounts[sectionRef.current] || 0;
        if (deltaY < 0 && subSectionRef.current < maxSub) newSub = subSectionRef.current + 1;
        else if (deltaY > 0 && subSectionRef.current > 0) newSub = subSectionRef.current - 1;
      }
      if (horizSwipe && subSectionRef.current > 0 && newSec !== sectionRef.current) {
        teleportRef.current = true;
      }
      setSection(newSec);
      setSubSection(newSub);
      resetStyle();
    };
    const onMouseDown = (e) => onTouchStart(e);
    const onMouseMove = (e) => onTouchMove(e);
    const onMouseUp = () => onTouchEnd();
    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0 && subSectionRef.current > 0) {
        setSubSection((prev) => prev - 1);
      } else if (e.deltaY > 0) {
        const maxSub = subCounts[sectionRef.current] || 0;
        if (subSectionRef.current < maxSub) {
          setSubSection((prev) => prev + 1);
        }
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (sectionRef.current < sectionsCount - 1) {
          setSection((prev) => prev + 1);
        } else {
          setSection(2);
        }
      } else if (e.key === 'ArrowLeft') {
        if (sectionRef.current > 0) {
          setSection((prev) => prev - 1);
        } else {
          setSection(0);
        }
      } else if (e.key === 'ArrowDown') {
        const maxSub = subCounts[sectionRef.current] || 0;
        if (subSectionRef.current < maxSub) {
          setSubSection((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowUp' && subSectionRef.current > 0) {
        setSubSection((prev) => prev - 1);
      }
    };
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  // Эффект для анимации перемещения контента при изменении section и subSection
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const targetX = -section * vw;
    const targetY = -subSection * vh;
    if (teleportRef.current) {
      const tl = gsap.timeline();
      tl.to(content, { opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in' });
      tl.set(content, { x: targetX, y: targetY, scale: 1 });
      tl.to(content, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      teleportRef.current = false;
    } else if (prevRef.current.section !== section || prevRef.current.sub !== subSection) {
      // Можно выбрать тип easing в зависимости от направления свайпа
      gsap.to(content, { x: targetX, y: targetY, duration: 0.6, ease: 'power3.out' });
    }
    prevRef.current = { section, sub: subSection };
    // Сброс видео при смене секций/подсекций
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
      setIsButtonClicked(false);
      setShowOverlay(true);
    }
  }, [section, subSection]);

  // Обработчик клика для начала проигрывания видео
  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
      setShowTitle(true);
      setShowOverlay(true);
      setIsButtonClicked(false); // Сбрасываем состояние кнопки при паузе
    } else {
      videoRef.current.play()
        .then(() => {
          setIsVideoPlaying(true);
          setShowTitle(false);
          setShowOverlay(false);
          setIsButtonClicked(true); // Устанавливаем состояние кнопки при воспроизведении
        })
        .catch(error => {
          console.error('Error playing video:', error);
          setShowTitle(true);
          setIsButtonClicked(false);
          setShowOverlay(true);
        });
    }
  };
  const handleExploreClick = () => {
    if (!videoRef.current || isButtonClicked) return;
    setIsButtonClicked(true);
    setShowTitle(false);
    const video = videoRef.current;
    if (section === 0) {
      video.currentTime = 0;
    }
    video.play()
      .then(() => {
        setIsVideoPlaying(true);
      })
      .catch(() => {
        setShowTitle(true);
        setIsButtonClicked(false);
      });
  };
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-primary-dark select-none"
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      <div ref={contentRef} className="flex w-[300vw]">
        {/* Секция 1 */}
        <section className="flex-shrink-0 w-screen h-screen p-1 pb-40 flex flex-col justify-between relative overflow-hidden">
          <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center relative">
            {showTitle && (
              <h1 className="absolute top-7 left-1/2 -translate-x-1/2 text-3xl font-bold text-white z-10">
                Знакомство
              </h1>

            )}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover relative z-0 transition-all duration-300 ${isVideoPlaying ? 'opacity-100' : 'opacity-80'
                  }`}
                playsInline
                //poster="./assets/images/video-preview1.jpg"
                preload="metadata"
                onClick={handleVideoClick}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                  }
                }}
              >
                <source src="/videos/lol.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            {!isVideoPlaying && !isButtonClicked && (
              <div className="flex justify-center mb-10 relative z-10">
                <button
                  onClick={handleExploreClick}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2  
                     text-white font-bold py-3 px-6 rounded-xl  
                    transition-all duration-300 hover:bg-accent-primary hover:text-primary-dark active:bg-accent-highlight
                    bg-black/65"
                >
                  Смотреть
                </button>
              </div>
            )}
            {/* Кнопка перезагрузки видео */}
            {isVideoPlaying && (
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                  }
                }}
                className="absolute top-10 left-4 p-2 rounded-full bg-black/10 
                  hover:bg-accent-primary transition-all duration-300 z-10"
                title="Перезапустить видео"
              >
                <img src={repeatIcon} alt="Перезапустить" className="w-6 h-6" />
              </button>
            )}
          </div>
        </section>
        {/* ----------- Секция 2 ------------ */}
        <section className="flex-shrink-0 w-screen flex flex-col">
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-darker rounded-2xl shadow-xl flex flex-col">
              <h1 className="mt-7 text-center  text-3xl font-bold text-white">Кейсы</h1>
              {/* ----- Кейс ----- 1 */}
              <div className="w-[90%] mx-auto mt-4">
                <div className="bg-primary-medium rounded-3xl">
                  <div className="cursor-pointer transition-all duration-300 hover:scale-105">
                    <img src="/images/test1.jpg" alt="Лучший Кейс" className="w-full h-[10rem] rounded-3xl shadow-lg mb-2" />
                    <h3 className="text-white text-xl font-bold pl-4 pb-1"> Лучший кейс </h3>
                    <h4 className="text-white text-base pl-4 pb-4"> Маркетинг с нуля для премиум-спортзала </h4>
                  </div>
                </div>
              </div>
              {/* Другие кейсы */}
              <h2 className="mt-2 ml-5 text-xl font-bold text-white">Ещё кейсы</h2>
              <div className="flex gap-2 mt-4 px-6">
                {/* Кейс 1 */}
                <div className="flex-1 cursor-pointer transition-all duration-300 hover:scale-105">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl mb-2">
                    <img src="/images/test2.jpg" alt="Кейс 2" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-white text-sm font-bold text-center pb-1">"АМЕТИСТ"</h3>
                  <h4 className="text-white text-sm text-center">Строительство</h4>
                </div>
                {/* Кейс 2 */}
                <div className="flex-1 cursor-pointer transition-all duration-300 hover:scale-105">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl mb-2">
                    <img src="/images/test3.jpg" alt="Кейс 3" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-white text-sm font-bold text-center pb-1">"В ОБЛАКАХ"</h3>
                  <h4 className="text-white text-sm text-center">HoReCa</h4>
                </div>
                {/* Кейс 3 */}
                <div className="flex-1 cursor-pointer transition-all duration-300 hover:scale-105">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl mb-2">
                    <img src="/images/test4.jpg" alt="Кейс 4" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-white text-sm font-bold text-center pb-1">"ДОМ СТРАХА"</h3>
                  <h4 className="text-white text-sm text-center">Развлечения</h4>
                </div>
              </div>
            </div>
          </div>
          {/* --------- Секция 2.1 ---------- */}
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-darker rounded-2xl shadow-xl flex flex-col">
              <h1 className="mt-8 text-center text-2xl font-bold text-white">Самый провальный кейс</h1>
              {/* ----- Худший кейс ----- */}
              <div className="w-[90%] mx-auto mt-10">
                <div className="bg-primary-medium rounded-3xl">

                  <h3 className="text-white text-xl font-bold pt-3 pb-3 text-center"> И ВОТ ПОЧЕМУ: </h3>
                  <div className="relative">
                    <img src="/images/test5.jpg" alt="Худший Кейс" className="w-full h-[22rem] rounded-3xl shadow-lg mb-2" />
                    <button
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    text-white text-xl font-bold text-center py-3 px-6 rounded-xl
                    bg-black/50 hover:bg-black/70 transition-all duration-300"
                    >
                      ЧИТАТЬ
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* ----- Секция 2.2 ----- */}
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-darker rounded-2xl shadow-xl flex flex-col">
              <h1 className="mt-8 text-center text-2xl font-bold text-white">Мои клиенты</h1>
              <div className="grid grid-cols-3 gap-1 p-6">
                {[...Array(12)].map((_, index) => {
                  // Определяем группу для логотипа (0-2: группа 1, 3-5: группа 2, и т.д.)
                  const group = Math.floor(index / 3);

                  return (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden opacity-0" // Начальная прозрачность 0
                      ref={(el) => {
                        // Используем GSAP для анимации появления
                        if (el) {
                          // Убиваем существующую анимацию для элемента
                          gsap.killTweensOf(el);

                          // Сбрасываем начальное состояние
                          gsap.set(el, {
                            opacity: 0,
                            y: 20
                          });
                          // Создаем новую анимацию
                          gsap.to(el, {
                            opacity: 1,
                            y: 0,
                            duration: 2,
                            ease: "power2.out",
                            delay: 0.2 + group * 0.5 // Задержка зависит от группы
                          });
                        }
                      }}
                    >
                      <img
                        src={`/images/logo${index + 1}.png`}
                        alt={`Логотип клиента ${index + 1}`}
                        className="w-full h-full object-contain p-2 
                                 grayscale transition-all duration-300 
                                 hover:grayscale-0 hover:scale-105"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </section>
        {/* Секция 3 */}
        <section className="flex-shrink-0 w-screen flex flex-col">
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center">
              <h1 className="text-4xl font-bold text-accent-primary">ОБУЧЕНИЕ</h1>
            </div>
          </div>
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center">
              <h2 className="text-3xl font-bold text-accent-secondary">Секция 3.1</h2>
            </div>
          </div>
        </section>
        {/* Секция 4 */}
        <section className="flex-shrink-0 w-screen flex flex-col">
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center">
              <h1 className="text-4xl font-bold text-accent-primary">САЙТЫ</h1>
            </div>
          </div>
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center">
              <h2 className="text-3xl font-bold text-accent-secondary">Секция 4.1</h2>
            </div>
          </div>
        </section>
        {/* Секция 5 */}
        <section className="flex-shrink-0 w-screen flex flex-col">
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center">
              <h1 className="text-4xl font-bold text-accent-primary">КОНТАКТЫ</h1>
            </div>
          </div>
          <div className="h-screen p-1 pb-40 ">
            <div className="w-full h-full bg-primary-medium rounded-2xl shadow-xl flex items-center justify-center">
              <h2 className="text-3xl font-bold text-accent-secondary">Секция 5.1</h2>
            </div>
          </div>
        </section>
      </div >
      {/* Индикатор пагинации */}
      <div div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 w-[80vw] justify-between" >
        {
          [1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`h-0.5 w-[20vw] rounded-full transition-all duration-300 ${index === section + 1 ? 'bg-accent-primary' : 'bg-white/30'
                }`}
            />
          ))
        }
      </div >
      {/* Вертикальная пагинация */}
      < div className="fixed right-4 top-80 -translate-y-1/2 flex flex-col gap-3" >
        {(() => {
          //  -----------------------Получаем количество подсекций из 34 строки
          const subCount = [0, 2, 1, 1, 0][section];
          // Если количество подсекций 0, не показываем пагинацию
          if (subCount === 0) return null;
          // Создаем массив точек пагинации
          // Если subCount = 1, показываем 2 точки
          // Если subCount = 2, показываем 3 точки
          return Array.from({ length: subCount + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setSubSection(index)}
              className={`w-1 h-2 rounded-full transition-all duration-300 ${subSection === index
                ? 'bg-accent-primary scale-125'
                : 'bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Перейти к подсекции ${index + 1}`}
            />
          ));
        })()
        }
      </div >
      <BottomMenu
        currentSection={section + 1}
        currentSubSection={subSection}
        onNavigate={(sectionId) => {
          setSection(sectionId - 1);
          setSubSection(0);
        }}
      />

      {/* Кнопки навигации */}
      <div className="fixed bottom-28 w-full px-6 flex justify-between items-center">
        <button
          onClick={() => {
            if (section > 0) {
              setSection(section - 1);
              setSubSection(0);
            }
          }}
          disabled={section === 0}
          className={`p-2 rounded-full transition-all duration-300 ease-in-out transform
          ${section === 0
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-primary-darker hover:bg-accent-primary hover:scale-105 active:bg-accent-highlight'
            }`}
        >
          <img src={backIcon} alt="Назад" className="w-8 h-8" />
        </button>
        <button
          onClick={() => {
            if (section < 4) {
              setSection(section + 1);
              setSubSection(0);
            }
          }}
          disabled={section === 4}
          className={`p-2 rounded-full transition-all duration-700 ease-in-out hover:scale-105
            ${section === 4
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-primary-darker hover:bg-accent-highlight'
            }`}
        >
          <img src={forwardIcon} alt="Вперед" className="w-8 h-8 scale-x-[-1]" />
        </button>
        {/* Кнопка навигации вниз */}
        {(() => {
          const subCount = [0, 2, 1, 1, 0][section];
          if (subCount === 0 || subSection >= subCount) return null;

          return (
            <button
              onClick={() => setSubSection(subSection + 1)}
              className="fixed right-[11.5rem] bottom-24 p-2 rounded-full 
              bg-primary-darker hover:bg-accent-highlight transition-all duration-300
              bounce bounce-slow bounce-low hover:animate-none
              z-10"
              aria-label="Прокрутить вниз"
            >
              <img src={downIcon} alt="Вниз" className="w-8 h-8" />
            </button>
          );
        })()}
        {/* Кнопка навигации вверх */}
        {subSection > 0 && (
          <button
            onClick={() => setSubSection(subSection - 1)}
            className={`fixed right-[6rem] bottom-24 -translate-x-1/2 p-2 rounded-full 
              bg-primary-darker transition-all duration-300 ease-in-out transform
              ${subSection > 0
                ? 'opacity-100 hover:bg-accent-primary hover:scale-105'
                : 'opacity-50 cursor-not-allowed'
              } z-10`}
            aria-label="Прокрутить вверх"
          >
            <img
              src={downIcon}
              alt="Вверх"
              className="w-6 h-6 rotate-180"
            />
          </button>
        )}
      </div>
    </div >
  );
}