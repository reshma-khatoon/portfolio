 let counterValue=0;
        let display=document.getElementById('value')
          let increment=document.getElementById('increase')
          let decrement=document.getElementById('decrease')
          let refresh=document.getElementById('refresh')

          const incre=()=>{
            counterValue+=1;
            display.textContent=counterValue
          }
          const decre=()=>{
            counterValue-=1
            display.textContent=counterValue;
          }
          const refre=()=>{
            counterValue=0;
            display.textContent=counterValue
          }


          increment.addEventListener('click',incre)
          decrement.addEventListener('click',decre)
          refresh.addEventListener('click',refre)