import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Tools from "./components/Tools"
import Split from "react-split"
import { 
    onSnapshot, 
    doc, 
    addDoc, 
    deleteDoc,
    setDoc 
} from "firebase/firestore"
import { notesCollection, db } from "./firebase"

// версия с localStorage
// import {nanoid} from "nanoid"

export default function App() {

    const [theme, setTheme] = React.useState(()=>JSON.parse(localStorage.getItem("theme")) || false)
    const [notes, setNotes] = React.useState([])
    // версия с localStorage
    // const [notes, setNotes] = React.useState(()=>JSON.parse(localStorage.getItem("notes")) || [])

    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
    const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt)

    function toggleTheme(){
        setTheme(prevTheme => !prevTheme)
    }

    // версия с localStorage
    // React.useEffect(()=>{
    //     localStorage.setItem("notes", JSON.stringify(notes))
    // },[notes])

    React.useEffect(()=>{
        localStorage.setItem("theme", JSON.stringify(theme))
    },[theme])

    React.useEffect(()=>{
        const unsubscribe = onSnapshot(notesCollection,(snapshot)=>{
            const notesArr = snapshot.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id,
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    },[])
    
    React.useEffect(()=>{
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    },[notes])

    React.useEffect(()=>{
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    },[currentNote])

    React.useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            if(currentNote && (tempNoteText !== currentNote.body)){
                updateNote(tempNoteText)
            }
        },500)
        return ()=> clearTimeout(timeoutId)
    }, [tempNoteText])
    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    // версия с localStorage
    // function createNewNote() {
    //     const newNote = {
    //         id: nanoid(),
    //         body: "# Type your markdown note's title here"
    //     }
    //     setNotes(prevNotes => [newNote, ...prevNotes])
    //     setCurrentNoteId(newNote.id)
    // }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
    }
    // версия с localStorage
    // function updateNote(text) {
    //     setNotes(prevNotes => {
    //         const newNotes = []
    //         prevNotes.forEach((prevNote) => {
    //             if(prevNote.id === currentNoteId){
    //                 newNotes.unshift({ ...prevNote, body: text })
    //             } else{
    //                 newNotes.push(prevNote)
    //             }
    //         });
    //         return newNotes
    //     })
    // }

    async function deleteNote(noteId){
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)

        //костыль?
        if(notes[0]?.id === noteId){
            setCurrentNoteId(notes[1]?.id)
        } else{
            setCurrentNoteId(notes[0]?.id)
        }
        
    }
    // версия с localStorage
    // function deleteNote(e, noteId){
    //     setNotes(prevNote => prevNote.filter(note => note.id !== noteId))
    // }
    
    
    return (
        <main className={theme? "dark" : ""}>
        {
            notes.length > 0 
            ?
            <div className="note">
                <Split 
                    sizes={[30, 70]} 
                    direction="horizontal" 
                    className="split"
                >
                    <Sidebar
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    <Editor 
                            tempNoteText={tempNoteText} 
                            setTempNoteText={setTempNoteText} 
                        />
                </Split>
                <Tools
                    toggleTheme={toggleTheme}
                />
            </div>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
