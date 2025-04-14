'use client'
import { useEffect, useRef, useState } from "react"
import { IconArrow, IconMediaGallery, IconPlus, IconPlusCircle, IconUploadFirstView } from "./Icons"
import { useDispatch, useSelector } from "react-redux"
import { addPostMedia, changeActiveIndex, deleteActiveIndex, saveCroppedImage, swapPostMedia, updateImageTransform } from "@/store/slices/postUploadSlice"
import { RootState } from "@/store/store"
import Image from "next/image"
import { Rethink_Sans } from "next/font/google"

export default function CreatePostPopup(){
    const mediaFiles = useSelector((state: RootState) => state.createData.postMedia);
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 1,
            previewUrl: '/images/post-1.jpg',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 2,
            previewUrl: '/images/post-prev-1.jpg',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 3,
            previewUrl: '/images/food-1.png',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 4,
            previewUrl: '/images/post-1.jpg',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 5,
            previewUrl: '/images/post-prev-1.jpg',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 6,
            previewUrl: '/images/food-1.png',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 7,
            previewUrl: '/images/post-1.jpg',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 8,
            previewUrl: '/images/post-prev-1.jpg',
          }));
          dispatch(addPostMedia({
            name: 'test',
            size: 'test',
            type: 'test',
            order: 9,
            previewUrl: '/images/food-1.png',
          }));
    },[])
    if(!mediaFiles) return
    return(
        <div className="fixed w-[100vw] h-[100vh] top-0 left-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            {/* {!mediaFiles ?
                <PostUploadFirstView />
            : */}
                <CropSection/>
            {/* } */}
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
    return(
        <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="flex flex-col w-[490px] h-[520px] rounded-lg bg-[#F5F5F5] overflow-hidden">
            <div className="flex items-center justify-center w-full bg-white border-b-[1px] py-2 text-base font-semibold border-ss">
                Create new post
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
                <IconUploadFirstView/>
                <span className="text-xl">Drag photos and videos here</span>
                {isDragging && <span>dragginggggijgrj</span>}
                <label  className="bg-bl hover:bg-[#1877f2] text-white px-4 rounded-md text-sm font-semibold h-8 flex items-center cursor-pointer" htmlFor="fileInput">
                    Select From Computer
                </label>
                <input multiple onChange={()=>handleFileChange()} ref={fileInputRef} id="fileInput" className="hidden" type="file" />
            </div>
        </div>
    )
}
export function CropSection(){
    const sliderCurrentIndex = useSelector((state: RootState) => state.createData.activeIndex);
    const mediaFiles = useSelector((state: RootState) => state.createData.postMedia);
    const activeIndex = useSelector((state: RootState) => state.createData.activeIndex);
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
    if(!mediaFiles || sliderCurrentIndex == null) return
    return(
        <div className="flex flex-col w-[490px] h-[520px] rounded-lg bg-[#F5F5F5] overflow-hidden">
            <div className="flex items-center justify-center w-full bg-white border-b-[1px] py-2 text-base font-semibold border-ss">
                Crop
            </div>
            <div className="relative flex w-full h-full">
                <div style={{ transform: `translateX(-${sliderCurrentIndex * 100}%)` }} className="flex relative items-center flex-1">
                    {mediaFiles.length != activeIndex && mediaFiles.map((file, index) => (
                        
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
    const [thumnailSliderT,setThumnailSliderT] = useState(0)
    const thumnailSliderRef = useRef<HTMLElement>(null)
    const [rightArrowStatus,setRightArrowStatus] = useState(true)
    const postMedia = useSelector((state: RootState) => state.createData.postMedia);
    const [dragginElmIndex,setDragginElmIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLElement | null>(null)
    const dispatch = useDispatch()
    function handleChangeActiveIndex(index:number){
        dispatch(changeActiveIndex(index))
    }
    function deleteMediaPost(){
        if(sliderCurrentIndex == null) return
        // if(sliderCurrentIndex == postMedia.length - 1){
        //     handleChangeActiveIndex(sliderCurrentIndex - 1)
        //     setTimeout(()=>{
        //         dispatch(deleteActiveIndex())
        //     },10)

        // }
        // else{
            dispatch(deleteActiveIndex())
            if(sliderCurrentIndex != 0){
                setTimeout(()=>{
                    handleChangeActiveIndex(sliderCurrentIndex - 1)
                },10)
            }
        // }
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
    const [startDragPosition,setStartDragPosition] = useState(0)
    const [zindexIndex,setZindexIndex] = useState<number | null>(null)
    function dragStartHandler(event: React.DragEvent, dragginIndex: number) {
        setStartDragPosition(event.clientX);
        setDragginElmIndex(dragginIndex);
        setZindexIndex(dragginIndex)
        const img = new window.Image();
        img.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg=="; // یه SVG خالی
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
    const [draggingXPositoin,setDraggingXPositoin] = useState(0)

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
            <div className="bg-[#1a1a1acc] flex rounded-lg w-fit max-w-full justify-end mb-4 p-3">
                <div className=" w-full relative overflow-hidden">
                    <div ref={thumnailSliderRef} style={{ transform: `translateX(-${thumnailSliderT}px)` }} className="flex transition-transform duration-300 justify-start gap-2 w-full">
                        {postMedia.map((item,index)=>{
                            return (
                                <div onClick={()=>handleChangeActiveIndex(index)} key={index} className="size-[94px] relative cursor-pointer flex-shrink-0">
                                    <div style={{ transform: dragginElmIndex == index ? `translateX(${draggingXPositoin}px) scale(1.05)` : 'translateX(0) scale(1)' }} className={`size-[94px] relative cursor-pointer flex-shrink-0 select-none ${zindexIndex == index && 'z-10 scale-50'} ${dragginElmIndex != index && 'transition-transform'}`} draggable onDragStart={(event)=>dragStartHandler(event,index)} onDrag={(event)=>dragHandler(event)} onDragEnd={()=>dragEndHandler()}>
                                        <Image draggable={false} className={`h-full w-full transition-transform object-cover ${dragginElmIndex == index && ''}`} src={item.croppedDataURL} width={94} height={94} alt=""></Image>
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
            <div className="flex w-full justify-end">
                <div>
                    <span className="size-8 rounded-full bg-[#1a1a1acc] flex justify-center items-center cursor-pointer">
                        <IconMediaGallery className="text-white"/>
                    </span>
                </div>
            </div>
        </div>
    )
}

export function MovableImageContainer({ src, currentIndex }: { src: string,currentIndex:number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const dispatch = useDispatch();
  
    const postMedia = useSelector((state: RootState) => state.createData.postMedia);
    const activeIndex = useSelector((state: RootState) => state.createData.activeIndex);
    const activeImage = activeIndex !== null && postMedia ? postMedia[activeIndex] : null;
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
    if (!activeImage) return null;
  
    const position = activeImage.transform?.position || { x: 0, y: 0 };
    const scale = activeImage.transform?.scale || 1;
  
    const limitPosition = (x: number, y: number) => {
        if (!containerRef.current || !imgRef.current) return { x, y };
      
        const container = containerRef.current;
        const img = imgRef.current;
      
        const containerW = container.offsetWidth;
        const containerH = container.offsetHeight;
        // const imgW = img.naturalWidth * scale;
        // const imgH = img.naturalHeight * scale;
        const imgW = img.clientWidth * scale;
        const imgH = img.clientHeight * scale;
        // محاسبه محدودیت‌ها
        // const minX = containerW - imgW; // راست‌ترین موقعیت ممکن
        // const minX = containerW; // راست‌ترین موقعیت ممکن
        const minX = containerW - imgW; // راست‌ترین موقعیت ممکن
        const minY = containerH - imgH; // پایین‌ترین موقعیت ممکن
        const maxX = 0; // چپ‌ترین موقعیت ممکن
        const maxY = 0; // بالاترین موقعیت ممکن

        return {
          x: Math.min(maxX, Math.max(minX, x)),
          y: Math.min(maxY, Math.max(minY, y)),
        };
      };
      const updateReduxWithTransform = (
        newPos: { x: number; y: number },
        newScale: number,
        index?: number
      ) => {
        const targetIndex = index ?? activeIndex;
        if (targetIndex == null) return;
      
        dispatch(updateImageTransform({
          index: targetIndex,
          transform: { position: newPos, scale: newScale }
        }));
      
        if (!containerRef.current || !imgRef.current) return;
      
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
      
        const container = containerRef.current;
        const img = imgRef.current;
      
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      
        const realImgWidth = img.naturalWidth;
        const realImgHeight = img.naturalHeight;
      
        const scaleRatio = realImgWidth / (img.offsetWidth * newScale);
      
        ctx.drawImage(
          img,
          -newPos.x * scaleRatio,
          -newPos.y * scaleRatio,
          canvas.width * scaleRatio,
          canvas.height * scaleRatio,
          0,
          0,
          canvas.width,
          canvas.height
        );
      
        const dataURL = canvas.toDataURL("image/jpeg", 0.9);
        dispatch(saveCroppedImage({ index: targetIndex, croppedDataURL: dataURL }));
      };
  
    const handleMouseDown = (e: React.MouseEvent) => {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
  
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragging) return;
  
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      const limited = limitPosition(newX, newY);
      updateReduxWithTransform(limited, scale);
    };
    const handleMouseUp = () => setDragging(false);
  
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        
        const scaleDelta = e.deltaY < 0 ? 0.05 : -0.05;
        const newScale = Math.max(minScale, Math.min(3, scale + scaleDelta));
        const limited = limitPosition(position.x, position.y);
        
        updateReduxWithTransform(limited, newScale);
        };
    const [minScale, setMinScale] = useState(1);
  
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
            setMinScale(initialScale); // ذخیره حداقل مقیاس
          
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
    return (
        
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full overflow-hidden relative flex flex-shrink-0"
      >
        <img
          ref={imgRef}
          src={src}
          alt="Movable"
          draggable={false}
          className="absolute cursor-grab select-none"
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    );
  }