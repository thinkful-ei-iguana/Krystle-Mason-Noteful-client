import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import './App.css';
import NoteContext from '../NoteContext';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
        fetch('http://localhost:9090/notes'),
        fetch('http://localhost:9090/folders')
        ])
        .then(([notesRes, foldersRes]) => {
            if (!notesRes.ok)
                return notesRes.json().then(e => Promise.reject(e));
            if (!foldersRes.ok)
                return foldersRes.json().then(e => Promise.reject(e));

            return Promise.all([notesRes.json(), foldersRes.json()]);
        })
        .then(([notesData, foldersData]) => {
            this.setState({notes: notesData, folders: foldersData});
        })
        .catch(err => {
            console.error({err});
        });       
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                    <Route
                        exact
                        path={['/', '/folder/:folderId']}
                        // render={routeProps => (
                        //     <NoteListNav
                        //         folders={folders}
                        //         notes={notes}
                        //         {...routeProps}
                        //     />
                        // )}
                        component={NoteListNav}
                    />
                <Route
                    path="/note/:noteId"
                    // render={routeProps => {
                    //     const {noteId} = routeProps.match.params;
                    //     const note = findNote(notes, noteId) || {};
                    //     const folder = findFolder(folders, note.folderId);
                    //     return <NotePageNav {...routeProps} folder={folder} />;
                    // }}
                    component={NotePageNav}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        // render={routeProps => {
                        //     const {folderId} = routeProps.match.params;
                        //     const notesForFolder = getNotesForFolder(
                        //         notes,
                        //         folderId
                        //     );
                        //     return (
                        //         <NoteListMain
                        //             {...routeProps}
                        //             notes={notesForFolder}
                        //         />
                        //     );
                        // }}
                        component={NoteListMain}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    // render={routeProps => {
                    //     const {noteId} = routeProps.match.params;
                    //     const note = findNote(notes, noteId);
                    //     return <NotePageMain {...routeProps} note={note} />;
                    // }}
                    component={NotePageMain}
                />
            </>
        );
    }

    render() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote
        }

        return (
        <NoteContext.Provider value={contextValue}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        </NoteContext.Provider>
        );
    }
}

export default App;
