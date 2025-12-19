const button=document.getElementById('button')
    const jokes=document.getElementById('jokes')

    const getJoke= async () => {
    try {
        jokes.classList.add('loading')
        jokes.textContent='loading please wait'
       const response=await fetch('https://official-joke-api.appspot.com/random_joke');
   
       if(!response.ok){
        throw new Error("oops!something went wrong");
       
       }
        const data= await response.json();
                      jokes.textContent=`${data.setup}-${data.punchline}`
       jokes.classList.remove('loading')
    } catch (error) {
        jokes.textContent='something went wrong'
    }
}
        button.addEventListener('click',getJoke)
 