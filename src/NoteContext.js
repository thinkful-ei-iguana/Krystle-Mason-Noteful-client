import React from 'react'

const NoteContext = React.createContext({
  notes: [],
  folders: [],
  deleteNote: () => {}
})

export default NoteContext