// importing scss here so it gets compiled by vite
import './scss/main.scss'


const modals = document.querySelectorAll('dialog')
const modalTriggers = document.querySelectorAll('[data-modal]')

modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', async () => {
    const modal = document.getElementById(trigger.getAttribute('data-modal') || '')
    if (modal && modal instanceof HTMLDialogElement) {
      // await all animations to finish
      await awaitAnimations(modal).then(() => {
        modal.showModal()
      })

      modal.addEventListener('close', () => {
        closeModal(modal)
      })
    }
  })
})

async function closeModal(modal: HTMLDialogElement){
  // modal.open = true
  modal.setAttribute('closing', '')
  await awaitAnimations(modal).then(() => {
    modal.close()
    modal.removeAttribute('closing')
  })
} 


function awaitAnimations(element: Element) {
  return Promise.all(element.getAnimations().map(animation => animation.finished))
}