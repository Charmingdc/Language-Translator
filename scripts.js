const sourceLang = document.querySelector('#source');
const targetLang = document.querySelector('#target');
const swapBtn = document.querySelector('.swap');
const loadingDiv  = document.querySelector('#loading')
const word = document.querySelector('.input-box');
const sourcePair = document.querySelector('#source');
const targetPair = document.querySelector('#target');
const outputBox = document.querySelector('.output-box');
const errorModal = document.querySelector('.error-modal');
const errorTxt = document.querySelector('#error-txt');
let typingTimer;


window.onload = () => {
 fetch('./langs.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const langs = data;
    displayLangs(langs);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
}

const displayLangs = (langs) => {
  langs.forEach(lang => {
    const sourceOptions = document.createElement('option');
    sourceOptions.value = lang.code;
    sourceOptions.textContent = lang.name;
      
    const targetOptions = document.createElement('option');
    targetOptions.value = lang.code;
    targetOptions.textContent = lang.name;
   
    sourceLang.append(sourceOptions);
    targetLang.append(targetOptions);
  }); 
  
  swapBtn.addEventListener('click', () => {
    [sourceLang.value, targetLang.value] = [targetLang.value, sourceLang.value]
  });
    
}

word.addEventListener('input', () => {
  let url = `https://api.mymemory.translated.net/get?q=${word.value}&langpair=${sourcePair.value}|${targetPair.value}`;

 
  if (word.value == "") {
    word.style.border = '0.1rem solid red';
    errorModal.style.display = 'block';
    errorTxt.textContent = 'Input box cannot be empty';
    
    setTimeout(() => {
      word.style.border = '0rem solid white'
      errorModal.style.display = 'none';
    }, 2000);
  } else {
    
    loadingDiv.style.display = 'block';
    loadingDiv.innerHTML = 'Translating texts...';
    
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      loadingDiv.style.display = 'none';
    }, 2000);
    
    
    fetch(url)
     .then(response => {
       if (!response.ok) {
         throw new Error('Network response was not ok ' + response.statusText);
       }
       return response.json();
     })
     .then(data => {
       showTranslatedText(data)
     })
     .catch(error => {
       console.error('There has been a problem with your fetch operation:', error);
     })
  }
});


const showTranslatedText = (data) => {
  const result = data;

  if (result.responseStatus == "403") {
   
   errorModal.style.display = 'block';
   errorTxt.textContent = 'An error has occured, either one or the two selected language pair are invalid.';
   setTimeout(() => {
     errorModal.style.display = 'none';
   }, 4000);
  } else {
    outputBox.style.height = '5.2rem';
    outputBox.style.borderBottom = '0.1rem solid rgb(6, 6, 14)';
    outputBox.style.marginBottom = '1rem';
    outputBox.textContent = "";
    outputBox.textContent = result.responseData.translatedText;
  }
  console.log(result)
}
