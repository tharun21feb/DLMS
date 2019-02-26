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
            selectedDate: null,
            description: "Please insert Description",
            contentFile: null,
            fieldErrors: {},
            metadataFile: null,
            metadataFileName: "",
        };
            this.handleFileSelection = this.handleFileSelection.bind(this);
            this.saveMetadata = this.saveMetadata.bind(this); 
            this.saveMetadataCallback = props.onSave.bind(this);
            //this.formatDate = this.formatDate.bind(this);
        }
        
        handleFileSelection(evt) {
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
                //newState.fieldErrors['file'] = null;
                console.log(file.name);
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
           // var that =  this;
            var targetUrl = get_url(APP_URLS.METADATA_UPLOAD);
            this.state.selectedDate = new Date("1901-11-25"); 

            console.log("saveMetadata called"); 
            console.log(this.state.metadataFileName);
            console.log(this.state.description);
            console.log(targetUrl);
            console.log(this.state.selectedDate);
            const payload = new FormData();
      
            payload.append('updated_time', formatDate(this.state.selectedDate));
            Boolean(this.state.metadataFile) && payload.append('metadata_file', this.state.metadataFile);
            
            const currInstance = this;
            for (var pair of payload.entries()) {
                console.log(pair[0] + "<-- date / file --> " + pair[1]);
            }
            
                axios.post(targetUrl, payload, {
                responseType: 'json'
            }).then(function(response) {
                currInstance.saveMetadataCallbackCallback(response.data, false);
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