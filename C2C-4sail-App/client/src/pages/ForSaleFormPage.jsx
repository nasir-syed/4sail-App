import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function ForSaleFormPage() {

    const {id} = useParams();
    

    const [title, setTitle] = useState("")
    const [address, setAddress] = useState("")
    const [addedPhotos, setAddedPhotos] = useState([])
    const [photoLink, setPhotoLink] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(100)
    const [details, setDetails] = useState([])

    const [time, setTime] = useState('');
    const [usage, setUsage] = useState('');
    const [condition, setCondition] = useState('');

    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
            const newDetails = [time, usage, condition];
            setDetails(newDetails);
    }, [time, usage, condition]);

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get('/items/'+id)
        .then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPrice(data.price !== undefined ? data.price : 100); // Ensure price is set to 100 if undefined
            setTime(data.details[0])
            setUsage(data.details[1])
            setCondition(data.details[2])

        });
    },[id])

    function inputHeader(text){
        return (
            <h2 className ="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text){
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function addPhotoByLink(e){
        e.preventDefault()
        const {data:filename} = await axios.post('/uploadByLink', {link: photoLink})
        setAddedPhotos(prev => {
            return [...prev, filename] // returning the previous filenames and adding the newest one
        })
        setPhotoLink('');
    }

    async function uploadPhoto(e){
        const files = e.target.files;
        const data = new FormData()
        for (let i = 0; i< files.length; i++) {
            data.append('photos', files[i])
        }

        await axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            setAddedPhotos(prev => {
                return [...prev, ...filenames]
            })
        })
    }

    function makeRadioButtonGroup(name, options, selectedValue, setSelectedValue) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {options.map((option) => (
                    <label key={option} className="border border-primary border-2 p-4 m-1 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={selectedValue === option}
                            onChange={(e) => setSelectedValue(e.target.value)}
                        />
                        {option}
                    </label>
                ))}
            </div>
        );
    }

    async function saveItem(e) {
        e.preventDefault();

        const itemData = {title, address, addedPhotos, description, price, details}
        try {
            if(id){
                await axios.put("/items", {id, ...itemData})
                setRedirect(true)

            } else {
                await axios.post("/items", {...itemData})
                setRedirect(true);
            }
           
        } catch (error) {
            console.error("There was an error submitting the form!", error);
        }
    }

    function removePhoto(e, filename){
        e.preventDefault()
        setAddedPhotos([...addedPhotos.filter(photo => photo !== filename)])
    }

    if (redirect) {
        return <Navigate to="/account/forsale" />;
    }

    return (<div className="mt-5">
                <form onSubmit={saveItem}>
                    {preInput('Title', 'Title for your item.')}
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {preInput('Address', 'Location of the item.')}
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                     {preInput('Photos', 'Photos of the item.')}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Upload by link"
                            value={photoLink}
                            onChange={(e) => setPhotoLink(e.target.value)}
                        />
                        <button onClick={addPhotoByLink} className="bg-black mt-1 h-12 text-primary px-4 py-2 rounded-2xl transition duration-300 ease-in-out hover:bg-primary hover:text-secondary">Add&nbsp;photo</button>
                    </div>
                    <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                            <div key={index} className="relative h-32 flex">
                                <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/" + link} alt="" />
                                <button onClick={(e) => removePhoto(e,link)} className="absolute bottom-1 right-1 text-primary bg-black bg-opacity-50 rounded-2xl py-2 px-3 transition duration-300 ease-in-out hover:bg-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <label className="flex justify-center items-center cursor-pointer border bg-transparent rounded-2xl p-4 text-gray-600">
                        <input type="file" className="hidden" onChange={uploadPhoto}/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                        </label>
                    </div>
                    {preInput('Description', 'Describe the item.')}
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {preInput('Price', 'Set the selling price of the item.')}
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {preInput('Details', 'Provide specific details about the item.')}
                    <h3 className="text-lg mt-2">Time</h3>
                    {makeRadioButtonGroup("time", ['0-1 Year', '1-2 Years', '2-3 Years', '4-5 Years', '5+ Years'], time, setTime)}
                    <h3 className="text-lg mt-2">Usage</h3>
                    {makeRadioButtonGroup("usage", ['Brand New', 'Used Once', 'Slightly Used', 'Average Usage', 'Heavily Used'], usage, setUsage)}
                    <h3 className="text-lg mt-2">Condition</h3>
                    {makeRadioButtonGroup("condition", ['Flawless', 'Excellent', 'Good', 'Average', 'Bad'], condition, setCondition)}
                    <div>
                        <button className="bg-black text-primary p-2 mt-4 w-full rounded-2xl transition duration-300 ease-in-out hover:bg-primary hover:text-secondary">Save</button>
                    </div>
                </form>
            </div>
    )
}