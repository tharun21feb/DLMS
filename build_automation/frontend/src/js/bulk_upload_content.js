import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';

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

class BulkUploadContent extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileSelection = this.handleFileSelection.bind(this);
    }

    handleFileSelection(event) {
        event.persist();

        const selectedFiles = event.target.files;

    }

    saveSelectedFiles() {

    }

    render() {
        return (
            <Grid item xs={8}>
                <AppBar position="static" style={{ height: '50px', margin: 'auto'}}>
                    <Typography gutterBottom variant="subheading" style={{color: '#ffffff'}}>
                        Express Load Content
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
                    value={this.state.contentFileName}
                    margin="normal"
                />
                <input
                    accept="*"
                    className={'hidden'}
                    id="raised-button-file"
                    multiple
                    type="file"
                    ref={input => {this.fileInput = input;}}
                    onChange={this.handleFileSelection}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="raised" component="span">
                        Browse
                    </Button>
                </label>

                <Button variant="raised" component="span" onClick={this.saveSelectedFiles()}>
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
                    SnackbarContentProps={{
                        "style": this.getErrorClass()
                    }}
                />
            </Grid>
        )
    }

    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}

export default BulkUploadContent;
