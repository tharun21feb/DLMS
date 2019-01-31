import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import {creatMuiTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {APP_URLS, get_url} from "./url";
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
var Papa = require("papaparse");

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
            id: "",
            name: "",
            source: "",
            title: "",
           // creators: labels.creators,
            selectedDate: "",
            description: "Please insert Description",
           // coverages: labels.coverages,
            libraryVersion: "",
            menuFolder: "",
            subFolder: "",
           // subjects: labels.subjects,
            //keywords: labels.keywords,
            //workareas: labels.workareas,
          //  languages: labels.languages,
           // catalogers: labels.catalogers,
            copyright: "",
            rightsStatement: "",
            contributorName: "",
            contentFile: null,
            fieldErrors: {},
            contentFileName: "", //props.content.originalFileName ? props.content.originalFileName : '',
        };
            this.handleFileSelection = this.handleFileSelection.bind(this);
            this.saveMetadata = this.saveMetadata.bind(this); 
            this.saveMetadataCallback = props.onSave.bind(this);
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
        
        saveMetadata() {
           // var that =  this;
           var that = this; 
           var thisData = [];
            console.log("saveMetadata called"); 
            console.log(this.state.contentFileName);
            console.log(this.state.description);
            Papa.parse(this.state.contentFile, {
                
                header:true,
                complete: function(results) {
         
                    for (var i = 0; i < results.data.length-1; i++)  {
                    
                        thisData[i] = results.data[i];
                        console.log(thisData[i]);
                        var object = thisData[i];
                        
                        that.setState({
                                    contributorName: object["Contributor Name"],
                                    copyright: object["Copyright"],
                                    coverages: object["Coverage"],
                                    creators: object["Creator"],
                                    description: object["Description"],
                                    keywords: object["Keywords"],
                                    languages: object["Language"],
                                    libraryVersion: object["Library Version"],
                                    menuFolder: object["Menu Item/Main Folder"],
                                    rightsStatement: object["Rights Statement"],
                                    source: object["Source"],
                                    subFolder: object["Sub-Item/Subfolders"],
                                    subjects: object["Subject"],
                                    title: object["Title"],
                                    workareas: object["Work Area"],}
                        );
                        
                                    
     
                    }
                    var targetUrl = APP_URLS.CONTENTS_LIST;

                    const payload = new FormData();
                    var currentDate = new Date();
                    payload.append('content_file', that.state.contentFile);
                    payload.append('name', that.state.contentFileNamefile);
                    payload.append('description', that.state.description);
                    payload.append('updated_time', that.formatDate(currentDate));
                    payload.append('contributorName', that.state.contributorName);
                    
                    const currInstance = that;
                    if (that.state.id > 0) {
                        // Update an existing directory.
                        payload.append('id', that.state.id);
                        targetUrl = get_url(APP_URLS.CONTENT_DETAIL, {id:that.state.id});
                        axios.patch(targetUrl, payload, {
                            responseType: 'json'
                        }).then(function(response) {
                            currInstance.saveMetadataCallback(response.data, true);
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
                            currInstance.saveMetadataCallback(response.data, false);
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
                    
                   /* for (var property in object) {
                        if(object.hasOwnProperty(property)) {
                            if(object[property] === "")
                                object[property] = "No Value";
                            //console.log(property + " : " + object[property]);
                            payload.append(property, object[property]);
                             
                        }
                    }
                    
                    /*for (var keys of payload.keys()) {
                        console.log(keys);
                    }*/
                    //console.log(that.state);
                   
                }
                
            });
        }
        
        formatDate(input) {
        //this is something that needs to be fixed, i hardcoded a date....
        const year = input.getFullYear();
        let month = input.getMonth()+1;
        if (month < 10) {
            month = '0' + month;
        }
        let date = input.getDate();
        if (date < 10) {
            date = '0' + date;
        }
        return year + '-' + month + '-' + date;
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