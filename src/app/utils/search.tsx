export function getSearchHistory(){
    const t = JSON.parse(localStorage.getItem('searchHistory'))
    return t
}
export function addSingleSearch(type:'tag' | 'user',id : string,subtitle:string,profile_pic?:string):void {
    const t = getSearchHistory() || []
    const current : searchType = {type:type,id:id,subtitle:subtitle,profile_pic:profile_pic}
    const isInIt = t.filter((item)=>{
        return item.type == 'user' && item.id == id
    })
    console.log(isInIt)
    if(isInIt.length == 0){
        localStorage.setItem('searchHistory',JSON.stringify([...t,current]))
    }
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
