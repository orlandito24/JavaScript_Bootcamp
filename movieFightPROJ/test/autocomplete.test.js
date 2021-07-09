let waitFor = (selector) =>{
    return new Promise((resolve,reject) =>{
         let interval = setInterval(() => {
             if (document.querySelector(selector)) {
                 clearInterval(interval)
                 clearTimeout(timeout)
                 resolve()
             }
         }, 30);

         let timeout = setTimeout(() => {
             clearInterval(interval)
             reject()
         }, 2000);

    })
}


beforeEach(() =>{
    document.querySelector('#target').innerHTML = ''
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                {Title: 'Evengers'},
                {Title: 'CHciekn Little'},
                {Title: 'woah nelly'}
            ]
        },
        renderOption(movie){
            return movie.Title
        }
    })
})

it('Dropdown starts closed!', ()=>{
    let dropdown = document.querySelector('.dropdown')

    expect(dropdown.className).not.to.include('is-active')
})

it('After searching, dropdown opens up', async ()=>{
    let input = document.querySelector('input')
    input.value = 'avengers'
    input.dispatchEvent(new Event('input'))

    await waitFor('.dropdown-item')


    let dropdown = document.querySelector('.dropdown')

    expect(dropdown.className).to.include('is-active')
}) 

it('Woof Woof, movied were fetched', async()=>{

    let input = document.querySelector('input')
    input.value = 'avengers'
    input.dispatchEvent(new Event('input'))

    await waitFor('.dropdown-item')

    let items = document.querySelectorAll('.dropdown-item')

    expect(items.length).to.equal(3)
})


