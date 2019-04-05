import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import {creatMuiTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {APP_URLS, get_url} from "./url";
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import Papa from 'papaparse';
import * as uploadFuncs from './upload_content';

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
            console.log(props);
            this.state = {
           
            id: "",
            name: "", 
            selectedDate: null,
            fieldErrors: {},
            metadataFile: null,
            metadataFileName: "",
            data:[] ,
            //Below is the state of the upload content module; use this to adjust the metadata updates
            description: "",
            creators: props.content.creators,
            coverages: props.content.coverages,
            subjects: props.content.subjects,
            keywords: props.content.keywords,
            workareas: props.content.workareas,
            languages: props.content.languages,
            catalogers: props.content.catalogers,
            //fieldErrors: {},
            selectedDate: props.content.updatedDate,
            source: props.content.source,
            copyright: props.content.copyright,
            rightsStatement: props.content.rightsStatement,
            //contentFile: null,
            //contentFileName: props.content.originalFileName ? props.content.originalFileName : '',//*/
        };
            this.handleFileSelection = this.handleFileSelection.bind(this);
            this.saveMetadata = this.saveMetadata.bind(this); 
            this.saveMetadataCallback = props.onSave.bind(this);
        }
        
        handleFileSelection(evt) {
            var data;
            evt.persist();
            const file = evt.target.files[0];
            if (!Boolean(file)) { // If there is no file selected.
                return;
            }
            
            
            this.setState((prevState, props) => {
                const newState = {
                    metadataFile: file,
                    metadataFileName: file.name,
                    fieldErrors: prevState.fieldErrors,                   
                };
               
                return newState;
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
        
        saveMetadata() {
            console.dir("State: " + this.state);
            var parsed;
            var currentInstance = this;
            var matchedRecords = 0;
            var unmatchedRecords = 0; 
            var unmatchedArray = [];
            var matchedArray = [];

            Papa.parse(this.state.metadataFile, {
                header:true,
                delimiter:",",
                complete:function(results) {
                    
                    parsed = results.data;
                    
                    
                    axios.get(APP_URLS.CONTENTS_LIST, {
                        responseType: 'json'
                    }).then(function (response) {
                        currInstance.content = response.data;
                        console.log(currInstance.content);
                        console.log(parsed);
                        
                        for(var i = 0; i < parsed.length;i++) {
                            for (var j = 0; j < currInstance.content.length; j++) {
                                if(parsed[i]["File Name"] == currInstance.content[j].original_file_name) {
                                    console.log(currentInstance.content[j].original_file_name + " exists");
                                    matchedRecords++;
                                    /////////////////////////////
                                    const payload = new FormData();
                                    payload.append('name', parsed[i]["Title"]);
                                    payload.append('description', parsed[i]["Description"]);
                                    payload.append('creators', parsed[i]["Creator"]);
                                    payload.append('coverage', parsed[i]["Coverage"]);
                                    payload.append('subjects', parsed[i]["Subject"]);
                                    payload.append('language', parsed[i]["Language"]);
                                    payload.append('cataloger', parsed[i]["Cataloger"]);
                                    //payload.append('updated_time', this.formatDate(this.state.selectedDate));
                                    payload.append('content_file', currInstance.content[j].content_file);
                                    payload.append('source', parsed[i]["Source"]);
                                    payload.append('copyright', parsed[i]["License/Copyright"]);
                                    payload.append('rights_statement', parsed[i]["Rights Statement"]);
                                    //const currInstance = this;
                                    //if (this.state.id > 0) {
                                        // Update an existing directory.
                                        payload.append('id', currInstance.content[j].id);
                                        targetUrl = get_url(APP_URLS.CONTENT_DETAIL, {id:currInstance.content[j].id});
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
                                    //}
                                    //////////////////////SaveFromUploadContent
                                    if(matchedArray.indexOf(parsed[i]["File Name"]) == -1)
                                        matchedArray.push(parsed[i]["File Name"]);
                                }
                                else {
                                    if(unmatchedArray.indexOf(parsed[i]["File Name"]) == -1 &&
                                         matchedArray.indexOf(parsed[i]["File Name"]) == -1) {
                                        unmatchedRecords++;
                                        unmatchedArray.push(parsed[i]["File Name"]);
                                    }
                                }                                    
     
                            }             
                        }
                        
                        
                        console.log("Matched " + matchedRecords + " records");
                        console.log("Unmatched records: " + unmatchedRecords);
                        console.log(unmatchedArray);
                        console.log(matchedArray);
                        
                    }).catch(function (error) {
                        console.error(error);
                    });
                }
            });
            
            
            
            var targetUrl = get_url(APP_URLS.METADATA_UPLOAD);
            this.state.selectedDate = new Date("1901-11-25"); 
            
            const payload = new FormData();
     
            Boolean(this.state.metadataFile) && payload.append('metadata_file', this.state.metadataFile);
            payload.append('name', this.state.metadataFileName)
            const currInstance = this;
           
            
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
                                        value = {this.state.metadataFileName}
                                        margin="normal"
                                    />
									<input 
									accept=".csv, .xlsx, .txt"
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