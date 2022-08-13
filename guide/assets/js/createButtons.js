/// <reference types="@types/jquery" />
// @ts-check

function createButtons() {
  $('pre.hljs').append('<copy-button class="copy-button"></copy-button>');
  // Used to link to files, but not right now
  // $('p').each((x, elem) => {
  //   if (elem.innerText.startsWith('src/')) {
  //     let url = 'vscode://file/' +
  //       window.location.href
  //       .replace('file://', '')
  //       .replace('Guide.html', elem.innerText);

  //     $(elem).addClass('file-path');
  //     $(elem).click(() => {
  //       window.location.href = url;
  //     })
  //   }
  // });

}

customElements.define(
  'copy-button',
  class extends HTMLElement {
    button;
    constructor() {
      super();
    }

    connectedCallback() {
      this.button = document.createElement('button');
      this.button.className = 'copy-btn';
      this.button.innerHTML = 'copy';

      this.button.onclick = () => {
        this.button.innerHTML = 'copied';
        setTimeout(() => (this.button.innerHTML = 'copy'), 2000);
        copyToClipboard($(this).prev('code')[0]);
      };
      this.prepend(this.button);
    }
  }
);
