export function getSearchHistory(){
    const t = JSON.parse(localStorage.getItem('searchHistory'))
    return t
}
type searchType = {
    type:'tag' | 'page',
    id : string,
    subtitle : string
}
export function addSingleSearch(type:'tag' | 'page',id : string,subtitle:string):void {
    const t = getSearchHistory() || []
    const current : searchType = {type:type,id:id,subtitle:subtitle}
    console.log([...t,current])
    localStorage.setItem('searchHistory',JSON.stringify([...t,current]))
}
export function emptySearchHistory(){
    localStorage.setItem('searchHistory',JSON.stringify([]))
}
export function removeSingleSearch(type:'tag' | 'page',id : string):void {
    const t = getSearchHistory() || []
    console.log(t)
    // const current : searchType = {type:type,id:id,subtitle:subtitle}
    const n = t.filter((item)=>{
        if(item.type == type && item.id == id){
            return false
        }
        else{
            return true
        }
    })
    localStorage.setItem('searchHistory',JSON.stringify(n))
}
