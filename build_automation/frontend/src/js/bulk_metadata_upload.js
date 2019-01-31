import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import {creatMuiTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {APP_URLS, get_url} from "./url";
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
 
const style = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing.unit,
    },
    
});

class BulkMetadataUpload extends React.Component {	    
		constructor(props) {
            super(props);
            this.state = {
            /*id: props.content.id,
            name: props.content.name,
            source: props.content.source,
            title: props.content.title,
            creators: labels.creators,
            selectedDate: props.content.updatedDate,
            description: props.content.description,
            coverages: labels.coverages,
            libraryVersion: props.content.libraryVersion,
            menuFolder: props.content.menuFolder,
            subFolder: props.content.subFolder,
            subjects: labels.subjects,
            keywords: labels.keywords,
            workareas: labels.workareas,
            languages: labels.languages,
            catalogers: labels.catalogers,
            copyright: props.content.copyright,
            rightsStatement: props.content.rightsStatement,
            contributorName: props.content.contributorName,*/
            contentFile: null,
            fieldErrors: {},
            //contentFileName: props.content.originalFileName ? props.content.originalFileName : '',
        };
            this.handleFileSelection = this.handleFileSelection.bind(this);
        }
        
        handleFileSelection(evt) {
            evt.persist();
            const file = evt.target.files[0];
            if (!Boolean(file)) { // If there is no file selected.
                return;
            }
            this.setState((prevState, props) => {
                const newState = {
                    contentFile: file,
                    contentFileName: file.name,
                    fieldErrors: prevState.fieldErrors,
                };
                //newState.fieldErrors['file'] = null;
                return newState;
            });
        }
        //////ADDED SAVE AND IS_VALID FROM UPLOAD CONTENTS TO ATTEMPT TRANSMISSION OF  METADATA ::: BUSTED
        saveMetadata(evt) {
            /*if (!this.is_valid_state(!(this.state.id > 0))) {
			console.log("invalid state bro!!!!: " + this.state.id);
			// If it is in an invalid state, do not proceed with the save operation.
            return;
            }*/
            
            var targetUrl = APP_URLS.CONTENTS_LIST;
            
            Array.from(this.state.contentFile).forEach(file => {
                console.log("calling method: " + file.name);
                const payload = new FormData();
                var currentDate = new Date();
                Boolean(file) && payload.append('content_file', file);
                payload.append('name', file.name);
                payload.append('description', "Please insert a description.");
                payload.append('updated_time', this.formatDate(currentDate));
                const currInstance = this;
                if (this.state.id > 0) {
                    // Update an existing directory.
                    payload.append('id', this.state.id);
                    targetUrl = get_url(APP_URLS.CONTENT_DETAIL, {id:this.state.id});
                    axios.patch(targetUrl, payload, {
                        responseType: 'json'
                    }).then(function(response) {
                        currInstance.saveCallback(response.data, true);
                    }).catch(function(error) {
                        console.error("Error in updating the content", error);
                        console.error(error.response.data);
                        let errorMsg = 'Error in updating the content';
                        currInstance.setState({
                            message: errorMsg,
                            messageType: 'error'
                        });
                    });
                } else {
                    // Create a new directory.
                    axios.post(targetUrl, payload, {
                        responseType: 'json'
                    }).then(function(response) {
                        currInstance.saveCallback(response.data, false);
                    }).catch(function(error) {
                        console.error("Error in uploading the content", error);
                        console.error(error.response.data);
                        let errorMsg = 'Error in uploading the content';
                        currInstance.setState({
                            message: errorMsg,
                            messageType: 'error'
                        });
                    });
                }
            });
        }
        
        is_valid_state(is_save) {
        var hasErrors = false;
        const fieldErrors = {};
		console.log(this.state);
        /* if (!this.state.name || this.state.name.trim().length === 0) {
            hasErrors = true;
            fieldErrors['name'] = 'Name is required.';
        } */
        /* if (!this.state.description || this.state.description.trim().length === 0) {
            hasErrors = true;
            fieldErrors['description'] = 'Description is required.';
        } */
		if(!this.state.contentFileNames.length > 0) {
			hasErrors = true;
			fieldErrors['name'] = 'File names are required.';
		}
		
        if (hasErrors) {
            this.setState({fieldErrors});
        }
        return !hasErrors;
    }
        
		render(){
				return (
                                <Grid item xs = {8}>
                                    <TextField
                                        id="metadataFile"
                                        label="Metadata File"
                                        multiline
                                        disabled
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                       // error={this.state.fieldErrors.file ? true : false}
                                        value = {this.state.contentFileName}
                                        margin="normal"
                                    />
									<input 
									accept=".csv"
									className={"hidden"}
									id="metadata-upload-input"
									multiple
									type="file" 
									ref={input => {this.fileInput = input;}} 
                                    onChange={this.handleFileSelection}
									/>
	
								<label htmlFor="metadata-upload-input">
								<Button variant="contained" component="span">
                                    Browse
								</Button>
								</label>
                                <div style={{marginTop: '20px'}}> </div>
                                <Button variant="contained" component="span" onClick={this.saveMetadata}>
                                    Save
                                </Button>
                                </Grid>
					
			);
		}
	
}

export default BulkMetadataUpload;