'use client'
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import { IconArrow, IconArrowBack, IconClose, IconLoading, IconMapPin, IconMediaGallery, IconPlus, IconPlusCircle, IconUploadFirstView } from "./Icons"
import { useDispatch, useSelector } from "react-redux"
import { addMediaUserTag, addPostMedia, changeActiveIndex, changeAddingTagCoordinates, changeAddingTaggedUser, changeIsFinalPart, changeMediaAlt, changeMediaUserTagCoordinates, changeUploadingCompleted, changeUploadingPost, clearPostMedia, deleteActiveIndex, moveMediaUserTagCoordinates, removeMediaUserTag, saveCroppedImage, swapPostMedia, updateImageTransform } from "@/store/slices/postUploadSlice"
import { RootState } from "@/store/store"
import Image from "next/image"
import { SingleSearchResult } from "./SearchBar"
import { fetchSearchUserAndTag } from "@/api/searchApi"
import { useClickOutside } from "@/hooks/useClickOutside"
import { extractTags } from "@/utils/idAndHastagConvertor"
import { fetchAddPost } from "@/api/addPostApi"
import { t } from "i18next"
import { useTranslation } from "react-i18next"

export default function CreatePostPopup({closeHandler}:{closeHandler:()=>void}){
    const mediaFiles = useSelector((state: RootState) => state.createData.postMedia);
    const isFinalPart = useSelector((state: RootState) => state.createData.isFinalPart);
    const uploadingPost = useSelector((state: RootState) => state.createData.uploadingPost);
    const uploadingCompleted = useSelector((state: RootState) => state.createData.uploadingCompleted);
    const [toggleCancel,setToggleCancel] = useState(false)
    const dispatch = useDispatch()
    function closeEmptyCreatePost(){
        closeHandler()
        setToggleCancel(false)
        dispatch(clearPostMedia())
    }
    if(!mediaFiles) return
    return(
        <div className="fixed w-[100vw] h-[100vh] top-0 left-0 z-50 flex justify-center items-center">
            <div onClick={()=>uploadingCompleted ? closeEmptyCreatePost() : setToggleCancel(true)} className="absolute w-full h-full top-0 left-0 -z-10 bg-black bg-opacity-60"></div>
            {uploadingCompleted ?
                <PostUploadDone/>
                :uploadingPost ? 
                <UploadPostPopup/>
                :
                isFinalPart ?
                    <FinalPart/>
                    :
                    !mediaFiles || mediaFiles.length == 0 ?
                        <PostUploadFirstView />
                        :
                        <CropSection/>
                }
                {toggleCancel &&
                    <ClosePoppup closeHandler={closeEmptyCreatePost} cancelHandler={()=>setToggleCancel(false)}/>
                }
        </div>
    )
}
export function ClosePoppup({closeHandler,cancelHandler}:{closeHandler:()=>void,cancelHandler:()=>void}){
    return(
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-60 z-50">
            <div className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] rounded-lg overflow-hidden flex flex-col items-center justify-center">
                <div className="m-8 mb-4 w-full text-center">
                    <div className="text-xl">Discard post?</div>
                    <div className="text-sm text-gray">If you leave, your edits won't be saved.</div>
                </div>
                <button onClick={closeHandler} className="text-[#Ed4965] border-t-[1px] border-ss w-full h-12 flex items-center justify-center font-semibold">Discard</button>
                <button onClick={cancelHandler} className="border-t-[1px] border-ss w-full h-12 flex items-center justify-center">Cancel</button>
            </div>
        </div>
    )
}
export function PostUploadFirstView(){
    const dispatch = useDispatch()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false);


  const handleDrop = (event) => {
    if(!fileInputRef.current) return
    event.preventDefault();
    setIsDragging(false);

    fileInputRef.current.files = event.dataTransfer.files;
    handleFileChange()
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
    function handleFileChange(){
        if(!fileInputRef.current?.files) return
        for(let index = 0;index < fileInputRef.current.files.length;index++){
            dispatch(addPostMedia({
                name: fileInputRef.current.files[index].name,
                size: fileInputRef.current.files[index].size,
                type: fileInputRef.current.files[index].type,
                previewUrl: URL.createObjectURL(fileInputRef.current.files[index]),
              }));
        }
    }
    const { t } = useTranslation();
    return(
        <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="flex flex-col w-[490px] h-[520px] rounded-lg bg-[#F5F5F5] overflow-hidden">
            <div className="flex items-center justify-center w-full bg-white border-b-[1px] py-2 text-base font-semibold border-ss">
                {t('createnewpost')}
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
                <IconUploadFirstView/>
                <span className="text-xl">{t('drag')}</span>
                {isDragging && <span>{t('drop')}</span>}
                <label  className="bg-bl hover:bg-[#1877f2] text-white px-4 rounded-md text-sm font-semibold h-8 flex items-center cursor-pointer" htmlFor="fileInput">
                    {t('selectfromcomputer')}
                </label>
                <input multiple onChange={()=>handleFileChange()} ref={fileInputRef} id="fileInput" className="hidden" type="file" />
            </div>
        </div>
    )
}
export function CropSection(){
    const sliderCurrentIndex = useSelector((state: RootState) => state.createData.activeIndex);
    const mediaFiles = useSelector((state: RootState) => state.createData.postMedia);
    const dispatch = useDispatch()
    function  handleSliderChange(dir:'next' | 'prev'){
        if(!mediaFiles) return
        if(sliderCurrentIndex == null) return
        if(dir == 'next'){
            if(sliderCurrentIndex < mediaFiles.length - 1){
                dispatch(changeActiveIndex(sliderCurrentIndex + 1))
            }
        }
        else if(sliderCurrentIndex > 0){
            dispatch(changeActiveIndex(sliderCurrentIndex - 1))
        }
    }
    useEffect(()=>{
        dispatch(changeActiveIndex(0))
    },[])
    function moveToFinalPart(){
        dispatch(changeIsFinalPart(true))
    }
    const { t } = useTranslation();
    if(!mediaFiles || sliderCurrentIndex == null) return
    return(
        <div className="flex flex-col w-[400px] h-[570px] rounded-lg bg-[#F5F5F5] overflow-hidden">
            <div className="relative flex items-center w-full bg-white border-b-[1px] py-2 text-base font-semibold border-ss justify-end">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {t('crop')}
                </span>
                <span className="text-bl cursor-pointer px-4 hover:text-bll" onClick={moveToFinalPart}>{t('next')}</span>
            </div>
            <div className="relative flex w-full h-full">
                <div style={{ transform: `translateX(-${sliderCurrentIndex * 100}%)` }} className="flex relative items-center flex-1">
                    {mediaFiles.length != sliderCurrentIndex && mediaFiles.map((file, index) => (
                        <MovableImageContainer key={index} currentIndex={index} src={file.previewUrl} />
                    ))}
                </div>
                {mediaFiles.length > 1 && (
                    <>
                        {sliderCurrentIndex < mediaFiles.length - 1 && (
                        <span
                            onClick={() => handleSliderChange('next')}
                            className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center size-8 rounded-full bg-[#1a1a1acc] cursor-pointer"
                        >
                            <IconArrow className="text-white rotate-90 size-4" />
                        </span>
                        )}

                        {sliderCurrentIndex > 0 && (
                        <span
                            onClick={() => handleSliderChange('prev')}
                            className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center justify-center size-8 rounded-full bg-[#1a1a1acc] cursor-pointer"
                        >
                            <IconArrow className="text-white -rotate-90 size-4" />
                        </span>
                        )}
                        <div className="absolute bottom-4 flex gap-1 left-1/2 -translate-x-1/2">
                            {mediaFiles.map((_, index)=>{
                                return <span key={index} className={`size-2 block rounded-full ${index == sliderCurrentIndex ? 'bg-bl' : 'bg-[#A8A8A8]'}`}></span>
                            })}
                        </div>
                    </>
                    )}
                    <CropAction/>
                    

            </div>
        </div>
    )
}

export function CropAction(){
    const sliderCurrentIndex = useSelector((state: RootState) => state.createData.activeIndex);
    const [draggingXPositoin,setDraggingXPositoin] = useState(0)
    const [toggleMediaSlider,setToggleMediaSlider] = useState(false)
    const [thumnailSliderT,setThumnailSliderT] = useState(0)
    const thumnailSliderRef = useRef<HTMLElement>(null)
    const [rightArrowStatus,setRightArrowStatus] = useState(true)
    const postMedia = useSelector((state: RootState) => state.createData.postMedia);
    const [dragginElmIndex,setDragginElmIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLElement | null>(null)
    const [startDragPosition,setStartDragPosition] = useState(0)
    const [zindexIndex,setZindexIndex] = useState<number | null>(null)
    const mediaSliderRef = useRef(null)
    useClickOutside(mediaSliderRef,()=> setToggleMediaSlider(false))
    const dispatch = useDispatch()
    function handleChangeActiveIndex(index:number){
        dispatch(changeActiveIndex(index))
    }
    function deleteMediaPost(){
        if(sliderCurrentIndex == null) return
            dispatch(deleteActiveIndex())
            if(sliderCurrentIndex != 0){
                setTimeout(()=>{
                    handleChangeActiveIndex(sliderCurrentIndex - 1)
                },10)
            }
    }
    function handleThumnailSlider(dir:'next' | 'prev'){
        if(!thumnailSliderRef.current) return
        const rect = thumnailSliderRef.current.getBoundingClientRect()
        const elm_scrollWidth = thumnailSliderRef.current.scrollWidth
        const remainingScrollWidth = elm_scrollWidth - thumnailSliderT - rect.width
        if(dir == 'next'){
            if(rect.width < remainingScrollWidth){
                setThumnailSliderT(thumnailSliderT + rect.width)
            }
            else{
                setThumnailSliderT(thumnailSliderT + remainingScrollWidth)
            }
        }
        else{
            if(remainingScrollWidth - rect.width < 0){
                setThumnailSliderT(thumnailSliderT - rect.width)
            }
            else{
                setThumnailSliderT(0)
            }
        }
    }
    useEffect(()=>{
        if(!thumnailSliderRef.current) return
        const rect = thumnailSliderRef.current.getBoundingClientRect()
        const elm_scrollWidth = thumnailSliderRef.current.scrollWidth
        const remainingScrollWidth = elm_scrollWidth - thumnailSliderT - rect.width
        if(remainingScrollWidth != 0){
            setRightArrowStatus(true)
        }
        else{
            setRightArrowStatus(false)
        }
    },[thumnailSliderT])
    function dragStartHandler(event: React.DragEvent, dragginIndex: number) {
        setStartDragPosition(event.clientX);
        setDragginElmIndex(dragginIndex);
        setZindexIndex(dragginIndex)
        const img = new window.Image();
        img.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==";
        event.dataTransfer.setDragImage(img, 0, 0);
    }
    function dragHandler(event: React.DragEvent) {
        if (event.clientX === 0 || dragginElmIndex === null) return;
    
        const draggingX = event.clientX - startDragPosition;
        setDraggingXPositoin(draggingX);
    
        const thumnailItems = thumnailSliderRef.current?.children;
        if (!thumnailItems) return;
    
        Array.from(thumnailItems).forEach((child, index) => {
            if (index === dragginElmIndex) return;
        
            const rect = (child as HTMLElement).getBoundingClientRect();
            const middleX = rect.left + rect.width / 2;
        
            const currentX = event.clientX;
            const isMovingRight = currentX > startDragPosition;
        
            const shouldSwap =
                (isMovingRight && currentX > middleX && index > dragginElmIndex!) ||
                (!isMovingRight && currentX < middleX && index < dragginElmIndex!);
        
            if (shouldSwap) {
                dispatch(swapPostMedia({ from: dragginElmIndex!, to: index }));
                setDragginElmIndex(index);
                setZindexIndex(index);
                setStartDragPosition(currentX);
                if(sliderCurrentIndex == dragginElmIndex){
                    dispatch(changeActiveIndex(index))
                }
                else{
                    dispatch(changeActiveIndex(index))
                }
            }
        });
    }

    function dragEndHandler(){
        setDragginElmIndex(null)
    }
    useEffect(()=>{
        if(dragginElmIndex == null){
            setDraggingXPositoin(0)
            setTimeout(()=>{
                setZindexIndex(null)
            },150)
        }
    },[dragginElmIndex])
    function handleFileChange(){
        if(!fileInputRef.current?.files) return
        for(let index = 0;index < fileInputRef.current.files.length;index++){
            dispatch(addPostMedia({
                name: fileInputRef.current.files[index].name,
                size: fileInputRef.current.files[index].size,
                type: fileInputRef.current.files[index].type,
                previewUrl: URL.createObjectURL(fileInputRef.current.files[index]),
              }));
        }
    }
    if(!postMedia) return
    return(
        <div className="absolute bottom-0 flex flex-col justify-between w-full items-end p-4">
            {toggleMediaSlider && 
                <div ref={mediaSliderRef} className="bg-[#1a1a1acc] flex rounded-lg w-fit max-w-full justify-end mb-4 p-3">
                    <div className=" w-full relative overflow-hidden">
                        <div ref={thumnailSliderRef} style={{ transform: `translateX(-${thumnailSliderT}px)` }} className="flex transition-transform duration-300 justify-start gap-2 w-full">
                            {postMedia.map((item,index)=>{
                                return (
                                    <div onClick={()=>handleChangeActiveIndex(index)} key={index} className="size-[94px] relative cursor-pointer flex-shrink-0">
                                        <div style={{ transform: dragginElmIndex == index ? `translateX(${draggingXPositoin}px) scale(1.05)` : 'translateX(0) scale(1)' }} className={`size-[94px] relative cursor-pointer flex-shrink-0 select-none ${zindexIndex == index && 'z-10 scale-50'} ${dragginElmIndex != index && 'transition-transform'}`} draggable onDragStart={(event)=>dragStartHandler(event,index)} onDrag={(event)=>dragHandler(event)} onDragEnd={()=>dragEndHandler()}>
                                            {item.croppedDataURL && 
                                                <Image draggable={false} className={`h-full w-full transition-transform object-cover ${dragginElmIndex == index && ''}`} src={item.croppedDataURL} width={94} height={94} alt=""></Image>
                                            }
                                            {sliderCurrentIndex == index ?
                                                <span onClick={deleteMediaPost} className="size-[20px] cursor-pointer flex justify-center items-center absolute top-1 right-1 bg-[#1a1a1acc] rounded-full">
                                                    <IconPlus className="text-white size-3 rotate-45" />
                                                </span>
                                                :
                                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
                                                
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {rightArrowStatus && 
                            <span onClick={()=>{handleThumnailSlider('next')}} className="absolute top-1/2 right-2 -translate-y-1/2 bg-[position:-162px_-98px] bg-[url(/images/icons.png)] w-[30px] h-[30px] cursor-pointer"></span>
                        }
                        {thumnailSliderT != 0 && 
                            <span onClick={()=>{handleThumnailSlider('prev')}} className="absolute top-1/2 left-2 -translate-y-1/2 rotate-180 bg-[position:-162px_-98px] bg-[url(/images/icons.png)] w-[30px] h-[30px] cursor-pointer"></span>
                        }
                        
                    </div>
                    <label className="size-12 border active:bg-[#efefef] cursor-pointer flex-shrink-0 ml-2 border-[#dbdbdb] rounded-full flex justify-center items-center" htmlFor="inputFile">
                            <IconPlus className="text-gray"/>
                    </label>
                        <input ref={fileInputRef} onChange={()=>handleFileChange()} id="inputFile" className="hidden" type="file" multiple />
                </div>
            }

            <div className="flex w-full justify-end">
                <div>
                    <span onClick={()=>setToggleMediaSlider(true)} className={`size-8 rounded-full ${toggleMediaSlider ? 'bg-white' : 'bg-[#1a1a1acc]'} flex justify-center items-center cursor-pointer`}>
                        <IconMediaGallery className={toggleMediaSlider ? "text-black" :"text-white"}/>
                    </span>
                </div>
            </div>
        </div>
    )
}

export function MovableImageContainer({ src, currentIndex, FinalPart = false }) {
    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const dispatch = useDispatch();
    const postMedia = useSelector((state) => state.createData.postMedia);
    const activeIndex = useSelector((state) => state.createData.activeIndex);
    const [minScale, setMinScale] = useState(1);
    const activeImage = activeIndex !== null && postMedia ? postMedia[activeIndex] : null;
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
    const [tagDragging, setTagDragging] = useState(false);
    if (!activeImage) return null;
  
    const position = activeImage.transform?.position || { x: 0, y: 0 };
    const scale = activeImage.transform?.scale || 1;
  
    const limitPosition = (x, y) => {
      if (!containerRef.current || !imgRef.current) return { x, y };
  
      const container = containerRef.current;
      const img = imgRef.current;
  
      const containerW = container.offsetWidth;
      const containerH = container.offsetHeight;
      const imgW = img.clientWidth * scale;
      const imgH = img.clientHeight * scale;
      const minX = containerW - imgW;
      const minY = containerH - imgH;
      const maxX = 0;
      const maxY = 0;
  
      return {
        x: Math.min(maxX, Math.max(minX, x)),
        y: Math.min(maxY, Math.max(minY, y)),
      };
    };
  
    const updateReduxWithTransform = (newPos, newScale, index) => {
      const targetIndex = index ?? activeIndex;
      if (targetIndex == null) return;
  
      dispatch(updateImageTransform({
        index: targetIndex,
        transform: { position: newPos, scale: newScale },
      }));
  
      if (!containerRef.current || !imgRef.current) return;
  
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      const container = containerRef.current;
      const img = imgRef.current;
  
      const upscaleFactor = 2;
      canvas.width = container.offsetWidth * upscaleFactor;
      canvas.height = container.offsetHeight * upscaleFactor;
  
      const realImgWidth = img.naturalWidth;
      const realImgHeight = img.naturalHeight;
  
      const scaleRatio = realImgWidth / (img.offsetWidth * newScale);
  
      ctx.scale(upscaleFactor, upscaleFactor);
      ctx.drawImage(
        img,
        -newPos.x * scaleRatio,
        -newPos.y * scaleRatio,
        canvas.width * scaleRatio / upscaleFactor,
        canvas.height * scaleRatio / upscaleFactor,
        0,
        0,
        canvas.width / upscaleFactor,
        canvas.height / upscaleFactor
      );
  
      const dataURL = canvas.toDataURL("image/jpeg", 1);
      dispatch(saveCroppedImage({ index: targetIndex, croppedDataURL: dataURL }));
    };
  
  
    const handleMouseDown = (e: React.MouseEvent) => {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
  
    const handleMouseMove = (e: React.MouseEvent) => {
        if(FinalPart) return

      if (!dragging) return;
  
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      const limited = limitPosition(newX, newY);
      updateReduxWithTransform(limited, scale);
    };
    const handleMouseUp = () => setDragging(false);
  
    const handleWheel = (e: React.WheelEvent) => {
        if(FinalPart) return
        e.preventDefault();
        
        const scaleDelta = e.deltaY < 0 ? 0.05 : -0.05;
        const newScale = Math.max(minScale, Math.min(3, scale + scaleDelta));
        const limited = limitPosition(position.x, position.y);
        
        updateReduxWithTransform(limited, newScale);
        };
  
    useEffect(() => {
        const img = imgRef.current;
        const container = containerRef.current;
        if (!img || !container) return;

        const handleLoad = () => {
            const imgW = img.naturalWidth;
            const imgH = img.naturalHeight;
            const containerW = container.offsetWidth;
            const containerH = container.offsetHeight;
          
            const scaleX = containerW / imgW;
            const scaleY = containerH / imgH;
          
            const initialScale = Math.max(scaleX, scaleY, 1);
            setMinScale(initialScale);
          
            const limited = limitPosition(0, 0);
            updateReduxWithTransform(limited, initialScale, currentIndex);
          };
      
        if (img.complete) {
          handleLoad();
        } else {
          img.addEventListener("load", handleLoad);
          return () => {
            img.removeEventListener("load", handleLoad);
          };
        }
      }, []);
      function togglingAddTag(event: React.MouseEvent<HTMLDivElement>) {
        if (!containerRef.current) return;
        if(event.target.tagName != 'IMG') return
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        dispatch(changeAddingTaggedUser(true))
        dispatch(changeAddingTagCoordinates({x,y}))
      }
      function removeTag(username:string){
        dispatch(removeMediaUserTag(username))
      }
      function tagDragStart(event:React.MouseEvent<HTMLDivElement>){
        setTagDragging(true)
        setDragStartPosition({x:event.clientX,y:event.clientY})
      }
    function tagDragHandler(event,username){
        if(!tagDragging) return
        const coordinates = {x:event.clientX - dragStartPosition.x,y:event.clientY - dragStartPosition.y}
        setDragStartPosition({x:event.clientX,y:event.clientY})
        dispatch(moveMediaUserTagCoordinates({username:username,coordinates:coordinates}))
    }
    function tagDragEnd(){
        setTagDragging(false)
    }
    if(!src) return
    return (
        
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full relative flex flex-shrink-0 overflow-hidden select-none"
      >
            <img
            ref={imgRef}
            src={src}
            alt="Movable"
            draggable={false}
            className={`absolute ${!FinalPart ? 'cursor-grab' : 'cursor-crosshair'} select-none`}
            onClick={(event)=>FinalPart ? togglingAddTag(event) :{}}
            onMouseDown={handleMouseDown}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "top left",
                }}
                />
            {
                postMedia && postMedia[activeIndex].tagged_user && postMedia[activeIndex].tagged_user.map((tagged,index)=>{
                    return(
                        <div onMouseDown={(event)=>tagDragStart(event,tagged.username)} onMouseMove={(event)=>tagDragHandler(event,tagged.username)} onMouseUp={tagDragEnd} onMouseLeave={tagDragEnd} key={index} style={{top:tagged.coordinates.y + 5,left:tagged.coordinates.x}} className={`-translate-x-1/2 origin-top  px-3 h-9 flex items-center absolute rounded-[4px] text-white bg-black bg-opacity-80 gap-3 select-none`}>
                            <span className="block absolute -top-[5px] left-1/2 -translate-x-1/2 border-b-[6px] border-l-transparent border-r-transparent border-l-[6px] border-r-[6px] border-b-black border-opacity-80 w-0 h-0"></span>
                            <span className="font-semibold text-sm">{tagged.username}</span>
                            <span className="cursor-pointer" onClick={()=>{removeTag(tagged.username)}}>
                                <IconClose className={'size-4 text-white'}/>
                            </span>
                        </div>
                    )
                })
            }
      </div>
    );
  }

export function AddTagPopup({x,y}:{x:number,y:number}){
    const [searchValue,setSearchvalue] = useState('')
    const [searchList,setSearchList] = useState<null | [{id:string,profile}]>([])
    const [searchLoading,setSearchLoading] = useState(false)
    const [isTopOpen,setIsTopOpen] = useState(true)
    const dispatch = useDispatch()
    async function fetchSearch(){
        setSearchLoading(true)
        const response = await fetchSearchUserAndTag('user',searchValue.replace('@',''))
        const jsonRes = await response.json()
        if(response.status == 200){
            setSearchList(jsonRes)
        }
        setSearchLoading(false)
    }
    useEffect(()=>{
        if(!searchValue) return
        fetchSearch()
        console.log(searchValue)
    },[searchValue])
    function addUserTag(event,username){
        event.preventDefault()
        console.log(event.target)
        dispatch(addMediaUserTag({username:username,coordinates:{x:x,y:y}}))
        dispatch(changeAddingTaggedUser(false))
    }
    return(
        <div style={{top:y + 8,left:x - 20}} className="absolute addTagPopup top-10 left-10 shadow-[4px_0px_8px_rgba(0,0,0,.1)] rounded-md w-[338px] h-[226px] bg-white z-50">
            <div className="overflow-hidden flex flex-col rounded-md h-full">
                <div className="w-full flex items-center justify-between py-[10px] px-2">
                    <span className="px-3 font-semibold">Tag:</span>
                    <div className="flex-1 flex bg-[#F5F5F5] border-[1px] border-ss rounded-md overflow-hidden h-8 items-center px-2">
                        <input value={searchValue} onChange={(e)=>setSearchvalue(e.target.value)} placeholder="Search" className="flex-1 h-full bg-transparent outline-none placeholder:text-sm placeholder:text-gray text-sm" type="text" />
                        <span onClick={()=>setSearchvalue('')}>
                            <IconClose className="size-[14px]"/>
                        </span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {searchList && !searchLoading && searchList.map((item,index)=>{
                        return(
                            <div key={index} onClick={(event)=>addUserTag(event,item.username)}>
                                <SingleSearchResult isAddTag={true} id={item.username} profilePic={item.profile_pic} subtitle={item.name} type={"user"}/>
                            </div>
                            )
                    })}
                </div>
                {searchLoading && 
                <span className="w-full h-full flex items-center justify-center">
                    <IconLoading className="size-8 fill-[#555555]"/>
                </span>
                }
            </div>
            <span className={`absolute ${isTopOpen ? '-top-[6px]' : '-bottom-[6px] rotate-180'} left-4 block w-0 h-0 border-b-[6px] border-b-white border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent`}></span>
        </div>
    )
}

export function FinalPart(){
    const mediaFiles = useSelector((state: RootState) => state.createData.postMedia);
    const sliderCurrentIndex = useSelector((state: RootState)=> state.createData.activeIndex)
    const addingTaggedUser = useSelector((state: RootState)=> state.createData.addingTaggedUser)
    const addingTagCoordinates = useSelector((state: RootState)=> state.createData.addingTagCoordinates)
    const uploadingPost = useSelector((state: RootState)=> state.createData.uploadingPost)
    const uploadingCompleted = useSelector((state: RootState)=> state.createData.uploadingCompleted)
    const dispatch = useDispatch()
    const [caption,setCaption] = useState('')
    const [location,setLocation] = useState('')
    const [accessibilityToggle,setAccessibilityToggle] = useState(false)
    const [settingToggle,setSettingToggle] = useState(true)
    const [isCommentOff,setIsCommentOff] = useState(false)
    const [isViewOff,setIsViewOff] = useState(false)
    function  handleSliderChange(dir:'next' | 'prev'){
        if(!mediaFiles) return
        if(sliderCurrentIndex == null) return
        if(dir == 'next'){
            if(sliderCurrentIndex < mediaFiles.length - 1){
                dispatch(changeActiveIndex(sliderCurrentIndex + 1))
            }
        }
        else if(sliderCurrentIndex > 0){
            dispatch(changeActiveIndex(sliderCurrentIndex - 1))
        }
        dispatch(changeAddingTaggedUser(false))
    }
    function handleAltChange(event,index){
        dispatch(changeMediaAlt({index:index, alt:event.target.value}))
    }
    const imgContainerRef = useRef(null)
    useClickOutside(imgContainerRef,(event)=> event.target.closest('.img-container') || event.target.closest('.addTagPopup') ? {} : dispatch(changeAddingTaggedUser(false)))
    async function fetch_add_post(cleanedData){
        dispatch(changeUploadingPost(true))
        const response = await fetchAddPost(cleanedData)
        const jsonRes = await response.json()
        dispatch(changeUploadingPost(false))
        dispatch(changeUploadingCompleted(true))
    }
    function sharePostHandler(){
        const keysToRemove = ["previewUrl", "transform",'name','size','type','order'];
        const hashtags = extractTags(caption)
        const cleanedPostMedia = mediaFiles.map(item => {
        const cleaned = Object.fromEntries(
            Object.entries(item).filter(([key]) => !keysToRemove.includes(key))
        );
        return cleaned;
        });
        const cleanedData = {caption:caption,post_media:cleanedPostMedia,location:location,hashtags:hashtags,comment_disabled:isCommentOff,view_hide:isViewOff}
        fetch_add_post(cleanedData)
    }
    const { t } = useTranslation()
    if(sliderCurrentIndex == null || !mediaFiles) return
    return(
        <div className={`${uploadingPost || uploadingCompleted && 'hidden'}flex flex-col h-[570px] rounded-lg bg-[#F5F5F5]`}>
            <div className="relative flex items-center justify-between w-full bg-white rounded-t-lg border-b-[1px] py-2 text-base font-semibold border-ss">
                <span onClick={()=>dispatch(changeIsFinalPart(false))} className="cursor-pointer px-4">
                    <IconArrowBack/>
                </span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {t('createnewpost')}
                </span>
                <span onClick={()=>sharePostHandler()} className="text-bl hover:text-bll cursor-pointer px-4">
                    share
                </span>
            </div>
            <div className="flex w-full h-[530px]">
                <div className="relative flex w-[400px] h-full">
                    <div className="relative flex w-[400px] h-full overflow-hidden">
                        <div style={{ transform: `translateX(-${sliderCurrentIndex * 100}%)` }} className="flex relative items-center flex-1">
                            {mediaFiles.length != sliderCurrentIndex && mediaFiles.map((file, index) => (
                                <div ref={imgContainerRef} className="w-full h-full relative rounded-bl-lg overflow-hidden flex flex-shrink-0 img-container" key={index}>
                                    <MovableImageContainer currentIndex={index} src={file.croppedDataURL} FinalPart={true} />
                                </div>
                            ))}
                        </div>
                        {mediaFiles.length > 1 && (
                            <>
                                {sliderCurrentIndex < mediaFiles.length - 1 && (
                                <span
                                    onClick={() => handleSliderChange('next')}
                                    className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center size-8 rounded-full bg-[#1a1a1acc] cursor-pointer"
                                >
                                    <IconArrow className="text-white rotate-90 size-4" />
                                </span>
                                )}

                                {sliderCurrentIndex > 0 && (
                                <span
                                    onClick={() => handleSliderChange('prev')}
                                    className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center justify-center size-8 rounded-full bg-[#1a1a1acc] cursor-pointer"
                                >
                                    <IconArrow className="text-white -rotate-90 size-4" />
                                </span>
                                )}
                                <div className="absolute bottom-4 flex gap-1 left-1/2 -translate-x-1/2">
                                    {mediaFiles.map((_, index)=>{
                                        return <span key={index} className={`size-2 block rounded-full ${index == sliderCurrentIndex ? 'bg-bl' : 'bg-[#A8A8A8]'}`}></span>
                                    })}
                                </div>
                            </>
                            )}
                    </div>
                    {addingTaggedUser &&
                        <AddTagPopup x={addingTagCoordinates.x} y={addingTagCoordinates.y}/>
                    }
                </div>
                <div className="flex flex-col bg-white w-[324px] h-full overflow-y-auto">
                    <div className="p-4 border-b-[1px] border-ss">
                        <div className={`flex gap-3 items-center`}>
                            <div className={`size-7 rounded-full overflow-hidden flex-shrink-0 relative border border-ss`}>
                                <Image className="rounded-full" src={'/images/profile-img.jpeg'} alt="" width={28} height={28}></Image>
                            </div>
                            <div className={`flex flex-col text-sm leading-[18px] relative`}>
                                <div className="font-semibold truncate inline-block w-fit">
                                    test
                                </div>
                            </div>
                        </div>
                        <textarea maxLength={2200} value={caption} onChange={(e)=> setCaption(e.target.value)} className="resize-none outline-none min-h-40 w-full mt-4" name="" id="">test</textarea>
                        <div className="flex justify-end">
                            <div className="text-xs text-[#C7C7C7]">
                                <span>{caption.length}</span>/
                                <span>2,200</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex w-full justify-between items-center py-2">
                            <input className="flex-1 outline-none" type="text" placeholder={t('addlocation')} onChange={(e)=>setLocation(e.target.value)} value={location}/>
                            <span onClick={()=> location.length ? setLocation('') :{}} className={`${location.length && 'cursor-pointer'}`}>
                                {location.length ?
                                <IconClose className="size-4"/>
                                :
                                <IconMapPin className="size-4"/>
                                }
                            </span>
                        </div>
                        <div className="flex flex-col w-full py-4 select-none">
                            <div onClick={()=>setAccessibilityToggle(!accessibilityToggle)} className="w-full flex justify-between cursor-pointer">
                                <span className={accessibilityToggle ? 'font-medium' : ''}>{t('accessibility')}</span>
                                <IconArrow className={`size-4 ${!accessibilityToggle && 'rotate-180'}`}/>
                            </div>
                            <div className={accessibilityToggle ? 'block' : 'hidden'}>
                                <p className="text-gray text-xs my-3">{t('alttext')}</p>
                                <div className="flex flex-col gap-2 pb-8">
                                {mediaFiles.map((item,index)=>{
                                    return(
                                        <div key={index} className="flex gap-2">
                                            {item.croppedDataURL && 
                                                <Image src={item.croppedDataURL} width={44} height={44} alt=""></Image>
                                            }
                                            <input value={item.alt || ''} onChange={(e)=>handleAltChange(e,index)} className="flex-1 border-[1px] focus:border-[#a8a8a8] border-ss rounded-md p-1 px-3 outline-none" type="text" placeholder={t('altplaceholder')}/>
                                        </div>
                                    )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full select-none">
                            <div onClick={()=>setSettingToggle(!settingToggle)} className="w-full flex justify-between py-2 cursor-pointer">
                                <span className={settingToggle ? 'font-medium' : ''}>{t('advancedsettings')}</span>
                                <IconArrow className={`size-4 ${!settingToggle && 'rotate-180'}`}/>
                            </div>
                            <div className={settingToggle ? 'block' : 'hidden'}>
                                <div className="flex flex-col gap-2 pb-8">
                                    <div className="flex w-full justify-between items-center">
                                        <span className="pr-1">{t('hideviewtitle')}</span>
                                        <label htmlFor="hideView" className="has-[:checked]:bg-black rounded-2xl transition-all flex-shrink-0 bg-[#dbdfe4] h-6 w-11 flex relative items-center cursor-pointer">
                                            <input id="hideView" className="peer hidden" checked={isViewOff} onChange={(e)=>{setIsViewOff(e.target.checked)}} type="checkbox" />
                                            <span className="block size-5 rounded-full bg-white absolute transition-all peer-checked:left-[21px] left-[2px]"></span>
                                        </label>
                                    </div>
                                    <p className="text-gray text-xs">{t('hidetext')}</p>
                                </div>
                                <div className="flex flex-col gap-2 pb-8">
                                    <div className="flex w-full justify-between items-center">
                                        <span className="pr-1">{t('turnoffcommenting')}</span>
                                        <label htmlFor="commentStatus" className="has-[:checked]:bg-black rounded-2xl transition-all flex-shrink-0 bg-[#dbdfe4] h-6 w-11 flex relative items-center cursor-pointer">
                                            <input checked={isCommentOff} onChange={(e)=>setIsCommentOff(e.target.checked)} id="commentStatus" className="peer hidden" type="checkbox" />
                                            <span className="block size-5 rounded-full bg-white absolute transition-all peer-checked:left-[21px] left-[2px]"></span>
                                        </label>
                                    </div>
                                    <p className="text-gray text-xs">{t('offcommenttext')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export function UploadPostPopup(){
    return(
        <div className="flex flex-col w-[490px] h-[520px] rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-center w-full bg-white border-b-[1px] py-2 text-base font-semibold border-ss">
                {t('sharing')}
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
                <Image alt="" src={'/images/uploadPost.gif'} width={96} height={96}></Image>
            </div>
        </div>
    )
}
export function PostUploadDone(){
    return(
        <div className="flex flex-col w-[490px] h-[520px] rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-center w-full bg-white border-b-[1px] py-2 text-base font-semibold border-ss">
                {t('postshared')}
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
                <Image alt="" src={'/images/uploadPostComplete.gif'} width={96} height={96}></Image>
                <div className="text-xl">{t('postsharedtext')}</div>
            </div>
        </div>
    )
}
