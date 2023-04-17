/*
document.addEventListener('DOMContentLoaded', function () {
    var codeBlocks = document.querySelectorAll('pre > code');
  
    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.classList.add('copy-button');
  
      var parentPre = codeBlock.parentElement;
      parentPre.insertBefore(copyButton, codeBlock);
  
      copyButton.addEventListener('click', function () {
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeBlock.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        // Show a message or change the button text to indicate the code was copied
        copyButton.textContent = 'Copied';
        setTimeout(function () {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });
  });
*/
  /*
  document.addEventListener('DOMContentLoaded', function () {
    var codeBlocks = document.querySelectorAll('pre > code');
  
    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.classList.add('copy-button');
  
      var parentPre = codeBlock.parentNode;
      var wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('code-block-wrapper');
      parentPre.replaceWith(wrapperDiv);
      wrapperDiv.appendChild(parentPre);
      wrapperDiv.insertBefore(copyButton, parentPre);
  
      copyButton.addEventListener('click', function () {
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeBlock.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        // Show a message or change the button text to indicate the code was copied
        copyButton.textContent = 'Copied';
        setTimeout(function () {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });
  });
  */
 /*
  document.addEventListener('DOMContentLoaded', function () {
    var codeBlocks = document.querySelectorAll('pre > code');
  
    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.classList.add('copy-button');
  
      var parentPre = codeBlock.parentElement;
      parentPre.style.position = 'relative';
      copyButton.style.position = 'absolute';
      copyButton.style.top = '0';
      copyButton.style.right = '0';
      parentPre.appendChild(copyButton);
  
      copyButton.addEventListener('click', function () {
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeBlock.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        // Show a message or change the button text to indicate the code was copied
        copyButton.textContent = 'Copied';
        setTimeout(function () {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });
  });
  */
 /*
  document.addEventListener('DOMContentLoaded', function () {
    var codeBlocks = document.querySelectorAll('pre > code');
  
    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement('button');
      copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copy code';
      copyButton.classList.add('copy-button');
  
      var parentPre = codeBlock.parentNode;
      var wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('code-block-wrapper');
      parentPre.replaceWith(wrapperDiv);
      wrapperDiv.appendChild(parentPre);
  
      var headerDiv = document.createElement('div');
      headerDiv.classList.add('code-block-header');
      wrapperDiv.insertBefore(headerDiv, parentPre);
  
      var languageLabel = document.createElement('span');
      languageLabel.classList.add('language-label');
      languageLabel.textContent = codeBlock.getAttribute('data-lang') || 'code';
      headerDiv.appendChild(languageLabel);
  
      headerDiv.appendChild(copyButton);
  
      copyButton.addEventListener('click', function () {
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeBlock.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        // Show a message or change the button text to indicate the code was copied
        copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copied';
        setTimeout(function () {
          copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copy code';
        }, 2000);
      });
    });
  });
  */
 /*
  document.addEventListener('DOMContentLoaded', function () {
    var codeBlocks = document.querySelectorAll('pre > code');
  
    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement('button');
      copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copy code';
      copyButton.classList.add('copy-button');
  
      var parentPre = codeBlock.parentNode;
      var wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('code-block-wrapper');
      parentPre.replaceWith(wrapperDiv);
      wrapperDiv.appendChild(parentPre);
  
      var headerDiv = parentPre.querySelector('.code-block-header');
      if (!headerDiv) {
        headerDiv = document.createElement('div');
        headerDiv.classList.add('code-block-header');
        wrapperDiv.insertBefore(headerDiv, parentPre);
      }
  
      var languageLabel = document.createElement('span');
      languageLabel.classList.add('language-label');
      languageLabel.textContent = codeBlock.getAttribute('data-lang') || 'code';
      headerDiv.insertBefore(languageLabel, headerDiv.firstChild);
  
      headerDiv.appendChild(copyButton);
  
      copyButton.addEventListener('click', function () {
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeBlock.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        // Show a message or change the button text to indicate the code was copied
        copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copied';
        setTimeout(function () {
          copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copy code';
        }, 2000);
      });
    });
  });
  */
  document.addEventListener('DOMContentLoaded', function () {
    var codeBlocks = document.querySelectorAll('pre > code');
  
    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement('button');
      copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copy code';
      copyButton.classList.add('copy-button');
  
      var parentPre = codeBlock.parentNode;
      var wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('code-block-wrapper');
      parentPre.replaceWith(wrapperDiv);
      wrapperDiv.appendChild(parentPre);
  
      var headerDiv = parentPre.previousElementSibling;
      if (!headerDiv || !headerDiv.classList.contains('code-block-header')) {
        headerDiv = document.createElement('div');
        headerDiv.classList.add('code-block-header');
        wrapperDiv.insertBefore(headerDiv, parentPre);
      }
  
      var languageLabel = document.createElement('span');
      languageLabel.classList.add('language-label');
      languageLabel.textContent = codeBlock.getAttribute('data-lang') || 'code';
      headerDiv.insertBefore(languageLabel, headerDiv.firstChild);
  
      headerDiv.appendChild(copyButton);
  
      copyButton.addEventListener('click', function () {
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeBlock.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        // Show a message or change the button text to indicate the code was copied
        copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copied';
        setTimeout(function () {
          copyButton.innerHTML = '<span class="copy-icon">&#x1F4CB;</span>Copy code';
        }, 2000);
      });
    });
  });
  