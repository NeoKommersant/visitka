import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
const menuItems = [
   {
      id: 1,
      title: 'Знакомство',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
         </svg>
      ),
      subsections: []
   },
   {
      id: 2,
      title: 'Кейсы',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
         </svg>
      ),
      subsections: [
         {
            title: 'Кейсы',
            icon: (
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
            )
         },
         {
            title: 'Провал',
            icon: (
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            )
         },
         {
            title: 'Клиенты',
            icon: (
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            )
         }
      ]
   },
   {
      id: 3,
      title: 'Обучение',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
         </svg>
      ),
      subsections: []
   },
   {
      id: 4,
      title: 'Сайты',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
         </svg>
      ),
      subsections: []
   },
   {
      id: 5,
      title: 'Контакты',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
         </svg>
      ),
      subsections: []
   },
];
const BottomMenu = ({ currentSection, currentSubSection = 0, onNavigate }) => {
   const menuRef = useRef(null);
   const prevSection = useRef(currentSection);
   const prevSubSection = useRef(currentSubSection);
   useEffect(() => {

      const menuItem = menuRef.current?.children[currentSection - 1];
      if (!menuItem) return;
      // Анимация при смене подсекции
      const currentMenuItem = menuItems[currentSection - 1];
      if (currentMenuItem.subsections.length > 0 && prevSubSection.current !== currentSubSection) {
         const subsection = currentMenuItem.subsections[currentSubSection];
         if (subsection) {
            gsap.to(menuItem.querySelector('span'), {
               opacity: 0,
               y: -10,
               duration: 0.2,
               onComplete: () => {
                  menuItem.querySelector('span').textContent = subsection.title;
                  gsap.to(menuItem.querySelector('span'), {
                     opacity: 1,
                     y: 0,
                     duration: 0.3,
                     ease: "back.out"
                  });
               }
            });
         }
      }

      prevSection.current = currentSection;
      prevSubSection.current = currentSubSection;
   }, [currentSection, currentSubSection]);
   return (
      <nav className="fixed bottom-0 left-0 right-0 bg-primary-dark p-4">
         <div ref={menuRef} className="flex justify-around items-center max-w-screen-lg mx-auto">
            {menuItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center space-y-1 w-16 min-w-[4rem] 
                  ${currentSection === item.id ? 'text-accent-secondary' : 'text-gray-500'}
                  transform transition-all duration-300 hover:scale-105 hover:text-accent-primary`}
               >
                  {currentSection === item.id && item.subsections && item.subsections[currentSubSection]
                     ? item.subsections[currentSubSection].icon
                     : item.icon}
                  <span className="text-xs">
                     {currentSection === item.id && item.subsections && currentSubSection < item.subsections.length
                        ? item.subsections[currentSubSection].title
                        : item.title
                     }
                  </span>
               </button>
            ))}
         </div>
      </nav>
   );
};
export default BottomMenu;