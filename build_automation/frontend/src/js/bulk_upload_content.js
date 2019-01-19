import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {APP_URLS, get_url} from "./url";
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';

const styles = theme => ({
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
    input: {
        display: 'none',
    },
});


class BulkUploadContent extends React.Component{
    constructor(props) {
        super(props);
		//this.tagIdsTagsMap = this.buildTagIdTagsMap(props.allTags);
        //const labels = this.getAutoCompleteLabelsFromTagIds(props.content, this.tagIdsTagsMap);
        this.state = {
			//id: props.content.id,
			contentFile: {},
            contentFileNames: '',
            fieldErrors: {},

        };
		/* this.tags = props.allTags;
        //this.tagNameTagMap = this.buildTagNameTagMap(props.allTags);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);

        this.handleFileSelection=this.handleFileSelection.bind(this);
        this.saveContent=this.saveContent.bind(this); */
		
		
		
		/* super(props);
        //this.tagIdsTagsMap = this.buildTagIdTagsMap(props.allTags);
        //const labels = this.getAutoCompleteLabelsFromTagIds(props.content, this.tagIdsTagsMap);
        this.state = {
            id: props.content.id,
            name: props.content.name,
            description: props.content.description,
            creators: labels.creators,
            coverages: labels.coverages,
            subjects: labels.subjects,
            keywords: labels.keywords,
            workareas: labels.workareas,
            languages: labels.languages,
            catalogers: labels.catalogers,
            fieldErrors: {},
            selectedDate: props.content.updatedDate,
            source: props.content.source,
            copyright: props.content.copyright,
            rightsStatement: props.content.rightsStatement,
            contentFile: null,
            contentFileName: props.content.originalFileName ? props.content.originalFileName : '',
        }; */
        /* this.tags = props.allTags;
        this.tagNameTagMap = this.buildTagNameTagMap(props.allTags);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.handleDateChange=this.handleDateChange.bind(this);
        this.handleTagAddition=this.handleTagAddition.bind(this);
        this.handleCreatorAddition=this.handleCreatorAddition.bind(this);
        this.handleCoverageAddition=this.handleCoverageAddition.bind(this);
        this.handleSubjectAddition=this.handleSubjectAddition.bind(this);
        this.handleKeywordAddition=this.handleKeywordAddition.bind(this);
        this.handleWorkareaAddition=this.handleWorkareaAddition.bind(this);
        this.handleLanguageAddition=this.handleLanguageAddition.bind(this);
        this.handleCatalogerAddition=this.handleCatalogerAddition.bind(this);
        this.handleTagDeletion=this.handleTagDeletion.bind(this);
        this.handleCreatorDeletion=this.handleCreatorDeletion.bind(this);
        this.handleCoverageDeletion=this.handleCoverageDeletion.bind(this);
        this.handleSubjectDeletion=this.handleSubjectDeletion.bind(this);
        this.handleKeywordDeletion=this.handleKeywordDeletion.bind(this);
        this.handleWorkareaDeletion=this.handleWorkareaDeletion.bind(this);
        this.handleLanguageDeletion=this.handleLanguageDeletion.bind(this);
        this.handleCatalogerDeletion=this.handleCatalogerDeletion.bind(this); */
        this.handleFileSelection=this.handleFileSelection.bind(this);
        this.saveContent=this.saveContent.bind(this);
        //this.saveTag=this.saveTag.bind(this);
        this.saveCallback=props.onSave.bind(this);
    }
	
	/* buildTagIdTagsMap(tags) {
        // Builds a map of <Tag Id> - Tag map for each tag type.
        const tagIdTagMap = {};
        Object.keys(tags).forEach(eachTagType => {
            tagIdTagMap[eachTagType] = buildMapFromArray(tags[eachTagType], 'id');
        });
        return tagIdTagMap;
    } */
    /* buildTagNameTagMap(tags) {
        const tagNameTagMap = {};
        Object.keys(tags).forEach(eachTagType => {
            tagNameTagMap[eachTagType] = buildMapFromArray(tags[eachTagType], 'name');
        });
        return tagNameTagMap;
    } */
    /* getAutoCompleteLabelsFromTagIds(boardInfo, tagIdsTagsMap) {
        const retval = {};
        Object.keys(tagIdsTagsMap).forEach(eachTagType => {
            const selectedTagsForDir = boardInfo[eachTagType];
            const selectedTypeAllTags = tagIdsTagsMap[eachTagType];
            const labels = [];
            selectedTagsForDir.forEach(eachTagId => {
                labels.push(selectedTypeAllTags[eachTagId].name);
            });
            retval[eachTagType] = labels;
        });
        return retval;
    } */
	
	componentDidMount() {
        // this.loadData()
    }
	
	loadData() {
        const currInstance = this;
        axios.get(APP_URLS.TAG_LIST, {
            responseType: 'json'
        }).then(function (response) {
            currInstance.setState({
                tags: response.data
            })
        }).catch(function (error) {
            console.error(error);
            // TODO : Show the error message.
        });
    }
	
	formatDate(input) {
        
        return '2019' + '-' + '12' + '-' + '12';
    }
	
    saveContent(evt) {
		if (!this.is_valid_state(!(this.state.id > 0))) {
			console.log("invalid state bro!!!!: " + this.state.id);
			// If it is in an invalid state, do not proceed with the save operation.
            return;
        }
        var targetUrl = APP_URLS.CONTENTS_LIST;
		
		Array.from(this.state.contentFile).forEach(file => {
			console.log("calling method: " + file.name);
			const payload = new FormData();
			Boolean(file) && payload.append('content_file', file);
			payload.append('name', file.name);
			payload.append('description', "Please insert a description.");
			payload.append('updated_time', this.formatDate(this.state.selectedDate));
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

    handleFileSelection(evt) {
        evt.persist();
        const files = evt.target.files;
		var fileNames = [];

        console.log("files below");
		console.log(files);
		
		Array.from(files).forEach(file => fileNames.push(file.name));

        if (!Boolean(files)) { // If there is no file selected.
            return;
        }
        this.setState((prevState, props) => {
            const newState = {
                contentFile: files,
                contentFileNames: fileNames,
                fieldErrors: prevState.fieldErrors,
            };
			console.log(newState);
            newState.fieldErrors['files'] = null;
            return newState;
        });

     }

    render(){
        return (
            <Grid item xs={8}>
                <AppBar position="static" style={{ height: '50px', margin: 'auto'}}>
                    <Typography gutterBottom variant="subtitle1" style={{color: '#ffffff', textAlign: 'center'}}>
                        Express Content Loading
                    </Typography>
                </AppBar>
                <div style={{marginTop: '20px'}}> </div>
                <TextField
                    id="contentFiles"
                    label="Content Files"
                    multiline
                    disabled
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={this.state.fieldErrors.file ? true : false}
                    value={this.state.contentFileNames.toString()}
                    margin="normal"
                />
                <input
                    accept="*"
                    className={'hidden'}
                    id="upload-file"
                    multiple
                    type="file"
                    ref={input => {this.fileInput = input;}}
                    onChange={this.handleFileSelection}
                />
				
				
                <label htmlFor="upload-file">
                    <Button variant="contained" component="span">
                        Browse
                    </Button>
                </label>

                <div style={{marginTop: '20px'}}> </div>
                <Button variant="contained" component="span" onClick={this.saveContent}>
                    Save
                </Button>

                <div style={{marginTop: '20px'}}> </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={Boolean(this.state.message)}
                    onClose={this.handleCloseSnackbar}
                    message={<span>{this.state.message}</span>}
                    ContentProps={{
                        "style": this.getErrorClass()
                    }}
                />
            </Grid>
        )
    }
    getErrorClass() {
        return this.state.messageType === "error" ? {backgroundColor: '#B71C1C', fontWeight: 'normal'} : {};
    }

    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}

export default BulkUploadContent;
