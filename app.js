const inputText = document.querySelector('input')
let arrayWords = []
let timer = 60
let words = 0
let focused = 0
let boxWithWords = document.querySelector('.words-to-type')
const startNextGameButton = document.querySelector('.btn-start-game')
let whichLetter = 1;
let writtenWord = ''
let goodWord = false;

const initiate = ()=>{
    
    document.querySelector('.your-words').textContent = words
    document.querySelector('.your-time').textContent = timer

    fetch('https://random-word-api.herokuapp.com/word?number=10')
    .then(response => response.json())
    .then(data =>{
        arrayWords = data
        arrayWords.forEach(word =>{
            const span = document.createElement('span')
            span.textContent = ''
            span.className = 'random-word'

            for (let i = 0; i < word.length; i++){
               span.innerHTML += '<span class="single-letter">' + word[i] + '</span>'   
            }
            boxWithWords.append(span)
        })
        
        }
    )

    }

const typeWord = () => {
    const startCounting = setInterval(()=>{
        timer--        
    }, 1000)

    if (timer === 0) {
        return
    } 

    inputText.addEventListener('focus', ()=>{
        focused++

        if (focused === 1){
            timer = 60
        }
        if (timer === 0) return
        const startTimer = setInterval(()=>{
            
            document.querySelector('.your-time').textContent = timer
            if (timer === 0){
                clearInterval(startTimer)
                document.querySelector('.match-result').classList.add('active')
                startNextGameButton.classList.add('active')
                clearInterval(startTimer)
                clearInterval(startCounting)
            }

        }, 1000)
            
    })
    
    inputText.addEventListener('input', (e)=>{
                     
        if (timer === 0) {
            return
        } 

        writtenWord = '' 
        writtenWord = e.target.value
        
        if (writtenWord === arrayWords[0]){
            goodWord = true;
            inputText.value = ''
            words ++
            document.querySelector('.your-words').textContent = words

            fetch('https://random-word-api.herokuapp.com/word?number=1')
            .then(response => response.json())
            .then(data =>{
                arrayWords.shift(data)
                const span = document.createElement('span')    
                span.className = 'random-word'
                arrayWords.push(data[0])
                boxWithWords.firstElementChild.remove()

                for (let i =0; i<data[0].length; i++){
                    const single_letters = document.createElement('span')
                    single_letters.className = 'single-letter'
                    single_letters.textContent = data[0].charAt(i)
                    span.appendChild(single_letters)
                }
                boxWithWords.append(span)    
            })
            
        }

        let single_letter = document.querySelector(`.single-letter:nth-of-type(${whichLetter})`)

        if(single_letter.textContent === writtenWord.charAt(whichLetter - 1) ){
            if (goodWord){
                whichLetter = 0
                goodWord = false;
            }
            whichLetter ++
            single_letter.classList.remove('red')
            single_letter.classList.add('green')   
        }
        else  {
            single_letter.classList.add('red')
            
        }
    })
    
}

startNextGameButton.addEventListener('click', ()=> {
    window.location.reload(false);

    const allWordsInGame = document.querySelectorAll('.random-word')
    document.querySelector('.your-words').textContent = words
    document.querySelector('.your-time').textContent = timer
    for (let i=0; allWordsInGame.length > i; i++){
        allWordsInGame[i].remove()
    }
    startNextGameButton.classList.toggle('active')
    document.querySelector('.match-result').classList.toggle('active')
        
        
    initiate()
    typeWord()

})

initiate()
typeWord()
