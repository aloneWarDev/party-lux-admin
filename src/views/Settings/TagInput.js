
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import './TagInput.css'

function TagsInput({values , onChange , result ,inputBool}){
    const [tag ,setTag] = useState('')
	const [tags, setTags] = useState(values)
    // const [inputBoolean , setInputBoolean] = useState(inputBool)
    const handleKeyDown = e => {
		const {key} = e
		console.log("key: ",key)

		const newTag = tag.trim()

		if((key === ',' || key === 'Enter' || key === 'Tab') && newTag.length && !tags.includes(newTag)){
			e.preventDefault();
			setTags(
				prevTags => {
                    const latestChange = [...prevTags , newTag];
                    onChange(latestChange);
                    result(latestChange)
                    return latestChange;
                }
			)
			setTag('')
			// setTags([...tags, value])
		}
        else if( key === 'Backspace' && !newTag.length && tags.length){
		    e.preventDefault()

            const tagsCopy = [...tags];
            const lastTag = tagsCopy.pop()

            setTags(tagsCopy)
            onChange(tagsCopy)
            result(tagsCopy)
            setTag(lastTag)

        }

        // if(e.key !== 'Enter') return
        // const value = e.target.value
        // if(!value.trim()) return
        // setTags([...tags, value])
        // e.target.value = ''
    }

    const removeTag = (index) =>{ 
        setTags(prevTags =>{
            const latestTags =  prevTags.filter((tag, i) => i !== index)
            onChange(latestTags)
            result(latestTags)
            return latestTags
        }
           
        )
    }
    
	
	const handleChange = e => {
		const { value } = e.target
		setTag(value)
	}

    const submit = ()=>{
        result(tags)
        // setInputBoolean(!inputBoolean)
    }
    return (
        <div className={`${inputBool ? 'tags-input-container' : ''} `}  >
            { tags.map((tag, index) => (
                <div className="tag-item" key={index}>
                    <span className="text">{tag}</span>
                    <span className="close" onClick={() => removeTag(index)}>&times;</span>
                </div>
            )) }
            { inputBool && <input value={tag} onKeyDown={handleKeyDown}  onChange={handleChange} type="text" className="tags-input" placeholder="Type somthing" />}
            {/* { inputBoolean && <Button variant="info" onClick={submit} className="float-right">Save</Button>} */}
        </div>
    )
}

export default TagsInput
