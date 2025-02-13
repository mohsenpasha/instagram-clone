export function disableScroll() {
    document.body.classList.add('overflow-hidden')
    document.body.classList.add('w-[100vw]')
    document.body.classList.add('h-[100vh]')
    // document.body.style.overflow = 'hidden';
  }
  
  export function enableScroll() {
    document.body.classList.remove('overflow-hidden')
    document.body.classList.remove('w-[100vw]')
    document.body.classList.remove('h-[100vh]')
  }