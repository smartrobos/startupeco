import React, { useState, useEffect } from 'react';
import MyToolbar from './MyToolBar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import profilePicPlaceholder from '../assets/images/profile-pic-placeholder.jpeg';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import SaveIcon from '@mui/icons-material/Save';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import EditIcon from '@mui/icons-material/Edit';

import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Box,
} from '@mui/material';

import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const profileTypes = ['Entrepreneur', 'Mentor', 'Investor'];

const interests = [
    'Fintech',
    'AI',
    'Blockchain',
];

const skills = [
    'JavaScript', 'Python', 'Product Management',
];

const expertiseAreas = [
    'Leadership', 'Product Development', 'Market Strategy',
];

const industryFocusList = ["Tech", "Healthcare", "Education"];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const theme = useTheme();
    const [profileType, setprofileType] = useState([]);

    const initialEnterpreneurState = {
        background: '',
        experience: '',
        currentStartupFocus: '',
        goal: '',
        availability: '',
        preferredCommunication: 'email',
        interests: [],
        skills: [],
    };

    const initialMentorState = {
        professionalBackground: '',
        industryExperience: '',
        expertiseAreas: [],
        previousMentoringExperience: '',
        interests: [],
        mentoringGoals: '',
        availability: '',
        preferredMentoringMethod: 'videoCall',
    };

    const initialInvestorState = {
        investmentBackground: '',
        industryFocus: [],
        investmentCriteria: '',
        availability: '',
        goal: '',
        interests: [],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = (await getDoc(doc(db, "users", user.uid))).data();
                setprofileType(data.profile_types ?? ['entrepreneur']);
                setEntrepreneurFormValues(data.entrepreneur_details);
                setMentorFormValues(data.mentor_details);
                setInvestorFormValues(data.investor_details);
                console.log("Fetching user data: ", data);
            } catch (e) {
                console.error("Error fetching user details: ", e);
            }
        }
        fetchData();
    }, [user.uid]);

    const [name, setName] = useState(user.displayName);
    const [entrepreneurFormValues, setEntrepreneurFormValues] = useState(initialEnterpreneurState);

    const [mentorFormValues, setMentorFormValues] = useState(initialMentorState);

    const [investorFormValues, setInvestorFormValues] = useState(initialInvestorState);

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleInputChange = (event, type) => {
        const { name, value } = event.target;
        if (type === 'entrepreneur') {
            setEntrepreneurFormValues({
                ...entrepreneurFormValues,
                [name]: value
            });
        }
        else if (type === 'mentor') {
            setMentorFormValues({
                ...mentorFormValues,
                [name]: value
            });
        }
        else if (type === 'investor') {
            setInvestorFormValues({
                ...investorFormValues,
                [name]: value
            });
        }
    };

    const handleProfileTypeChange = (event) => {
        const value = event.target.value;
        if (value.length) {
            setprofileType(value);
        }
        if (!profileType.includes('entrepreneur')) {
            setEntrepreneurFormValues(initialEnterpreneurState);
        }
        else if (!profileType.includes('mentor')) {
            console.log("Not there");
            setMentorFormValues(initialMentorState);
        }
        else if (!profileType.includes('investor')) {
            setInvestorFormValues(initialInvestorState);
        }
    };

    const saveDetails = async (e) => {
        e.preventDefault();
        console.log("Saving Details..");
        let data = {
            name: name,
            profile_types: profileType,
            entrepreneur_details: entrepreneurFormValues,
            mentor_details: mentorFormValues,
            investor_details: investorFormValues,
        }
        console.log(data);
        if (activeStep === profileType.length - 1) {
            try {
                await setDoc(doc(db, "users", user.uid), data);
                console.log("Details updated successfully !!");
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        handleNext();
    }

    return (<div>
        <MyToolbar />
        <Grid container spacing={3} style={{ padding: 20 }}>
            <Grid item xs={12} lg={4}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px' }}>
                            <Avatar alt="Profile Pic" sx={{ width: 70, height: 70 }}
                                src={user != null ? user.photoURL : profilePicPlaceholder} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <h3 style={{ margin: 0 }}>{user?.displayName}</h3>
                                <h4 style={{ margin: 0 }}>{user?.email}</h4>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div" style={{ marginBottom: '15px' }}>Personal Information</Typography>
                        <Grid container spacing={3} style={{ width: '100%' }}>
                            <Grid item xs={12} sm={6} lg={4}>
                                <TextField name="name" value={name} onChange={(event) => setName(event.target.value)}
                                    label="Name" variant="outlined" style={{ width: '100%' }} />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="profileTypeLabel">Profile Type</InputLabel>
                                    <Select
                                        labelId="profileTypeLabel"
                                        id="profile-type-multi-select"
                                        multiple
                                        name="profileTypes" value={profileType} onChange={handleProfileTypeChange}
                                        placeholder='Select Profile Type'
                                        input={<OutlinedInput id="profile-type-multiple-chip" label="Profile Type" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {profileTypes.map((name) => (
                                            <MenuItem
                                                key={name.toLowerCase()}
                                                value={name.toLowerCase()}
                                                style={getStyles(name, profileType, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Divider orientation="horizontal" flexItem style={{ margin: '15px 0' }} />
                        <Stepper activeStep={activeStep}>
                            {profileType.map((label, index) => {
                                const stepProps = {};

                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === profileType.indexOf('entrepreneur') && profileType.includes('entrepreneur') && (
                            <Grid container spacing={3} style={{ width: '100%', padding: '20px 0 20px 40px' }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="background" value={entrepreneurFormValues.background} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                        label="Background" variant="outlined" style={{ width: '100%' }} placeholder="Software Engineer with 10 years in fintech" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="experience" value={entrepreneurFormValues.experience} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                        label="Experience" variant="outlined" style={{ width: '100%' }} placeholder="Founded two successful startups" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="currentStartupFocus" value={entrepreneurFormValues.currentStartupFocus} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                        label="Current Startup Focus" variant="outlined" style={{ width: '100%' }} placeholder="AI-driven financial services" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="interests-label">Interests</InputLabel>
                                        <Select
                                            labelId="interests-label"
                                            id="interests"
                                            multiple
                                            name="interests" value={entrepreneurFormValues.interests} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                            placeholder='Select interest'
                                            input={<OutlinedInput id="interests-multiple-chip" label="Interests" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {interests.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, entrepreneurFormValues.interests, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="availability" value={entrepreneurFormValues.availability} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                        label="Availability" variant="outlined" style={{ width: '100%' }} placeholder='Weekdays 9 AM - 5 PM' />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="goal" value={entrepreneurFormValues.goal} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                        label="Goal" variant="outlined" style={{ width: '100%' }} placeholder="Scaling current startup" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="preferredCommunicationLabel">Preferred Communication</InputLabel>
                                        <Select
                                            name="preferredCommunication" value={entrepreneurFormValues.preferredCommunication} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                            labelId="preferredCommunicationLabel"
                                            id="preferred-communication-select"
                                            label="Preferred Communication"
                                            placeholder='Select prefered communication'
                                        >
                                            <MenuItem value={'email'}>Email</MenuItem>
                                            <MenuItem value={'phone'}>Phone number</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8}>
                                    <FormControl fullWidth>
                                        <InputLabel id="skills-label">Skills</InputLabel>
                                        <Select
                                            labelId="skills-label"
                                            id="skills"
                                            multiple
                                            name="skills" value={entrepreneurFormValues.skills} onChange={(event) => handleInputChange(event, 'entrepreneur')}
                                            placeholder='Select skill'
                                            input={<OutlinedInput id="skills-multiple-chip" label="Skills" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {skills.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, entrepreneurFormValues.skills, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                        {activeStep === profileType.indexOf('mentor') && profileType.includes('mentor') && (
                            <Grid container spacing={3} style={{ width: '100%', padding: '20px 0 20px 40px' }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="professionalBackground" value={mentorFormValues.professionalBackground} onChange={(event) => handleInputChange(event, 'mentor')}
                                        label="Professional Background" variant="outlined" style={{ width: '100%' }} placeholder="Tech Executive with 20 years in the industry" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="industryExperience" value={mentorFormValues.industryExperience} onChange={(event) => handleInputChange(event, 'mentor')}
                                        label="Industry Experience" variant="outlined" style={{ width: '100%' }} placeholder="Led teams at Google and Amazon" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="expertise-areas-label">Expertise Areas</InputLabel>
                                        <Select
                                            labelId="expertise-areas-label"
                                            id="expertise-areas"
                                            multiple
                                            name="expertiseAreas" value={mentorFormValues.expertiseAreas} onChange={(event) => handleInputChange(event, 'mentor')}
                                            placeholder='Select Expertise Areas'
                                            input={<OutlinedInput id="expertise-areas-multiple-chip" label="Expertise Areas" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {expertiseAreas.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, mentorFormValues.expertiseAreas, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="previousMentoringExperience" value={mentorFormValues.previousMentoringExperience} onChange={(event) => handleInputChange(event, 'mentor')}
                                        label="Previous Mentoring Experience" variant="outlined" style={{ width: '100%' }} placeholder="Mentored over 50 startups" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="mentoringGoals" value={mentorFormValues.mentoringGoals} onChange={(event) => handleInputChange(event, 'mentor')}
                                        label="Mentoring Goals" variant="outlined" style={{ width: '100%' }} placeholder="Helping startups scale globally" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="availability" value={mentorFormValues.availability} onChange={(event) => handleInputChange(event, 'mentor')}
                                        label="Availability" variant="outlined" style={{ width: '100%' }} placeholder='Weekdays 9 AM - 5 PM' />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="preferredMentoringMethodLabel">Preferred Mentoring Method</InputLabel>
                                        <Select
                                            name="preferredMentoringMethod" value={mentorFormValues.preferredMentoringMethod} onChange={(event) => handleInputChange(event, 'mentor')}
                                            labelId="preferredMentoringMethodLabel"
                                            id="preferred-mentoring-method-select"
                                            label="Preferred Mentoring Method"
                                            placeholder='Preferred Mentoring Method'
                                        >
                                            <MenuItem value={'videoCall'}>Video calls</MenuItem>
                                            <MenuItem value={'whatsappChat'}>Whatsapp Chat</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="interests-label">Interests</InputLabel>
                                        <Select
                                            labelId="interests-label"
                                            id="interests"
                                            multiple
                                            name="interests" value={mentorFormValues.interests} onChange={(event) => handleInputChange(event, 'mentor')}
                                            placeholder='Select interest'
                                            input={<OutlinedInput id="interests-multiple-chip" label="Interests" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {interests.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, mentorFormValues.interests, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                        {(activeStep === profileType.indexOf('investor') || activeStep === profileType.length) && profileType.includes('investor') && (
                            <Grid container spacing={3} style={{ width: '100%', padding: '20px 0 20px 40px' }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="investmentBackground" value={investorFormValues.investmentBackground} onChange={(event) => handleInputChange(event, 'investor')}
                                        label="Investment Background" variant="outlined" style={{ width: '100%' }} placeholder="Venture capitalist with 15 years of experience" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="industry-focus-label">Industry Focus</InputLabel>
                                        <Select
                                            labelId="industry-focus-label"
                                            id="industry-focus"
                                            multiple
                                            name="industryFocus" value={investorFormValues.industryFocus} onChange={(event) => handleInputChange(event, 'investor')}
                                            placeholder='Select Industry Focus'
                                            input={<OutlinedInput id="industry-focus-multiple-chip" label="Industry Focus" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {industryFocusList.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, investorFormValues.industryFocus, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="investmentCriteria" value={investorFormValues.investmentCriteria} onChange={(event) => handleInputChange(event, 'investor')}
                                        label="Investment Criteria" variant="outlined" style={{ width: '100%' }} placeholder="Innovative solutions with high growth potential" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="availability" value={investorFormValues.availability} onChange={(event) => handleInputChange(event, 'investor')}
                                        label="Availability" variant="outlined" style={{ width: '100%' }} placeholder='Weekdays 9 AM - 5 PM' />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField name="goal" value={investorFormValues.goal} onChange={(event) => handleInputChange(event, 'investor')}
                                        label="Goal" variant="outlined" style={{ width: '100%' }} placeholder="Scaling current startup" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="interests-label">Interests</InputLabel>
                                        <Select
                                            labelId="interests-label"
                                            id="interests"
                                            multiple
                                            name="interests" value={investorFormValues.interests} onChange={(event) => handleInputChange(event, 'investor')}
                                            placeholder='Select interest'
                                            input={<OutlinedInput id="interests-multiple-chip" label="Interests" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {interests.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, investorFormValues.interests, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: activeStep < profileType.length ? 'space-between' : 'center', pl: 5, pr: 3 }}>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1, display: activeStep < profileType.length ? 'flex' : 'none' }}
                            ><NavigateBeforeIcon style={{ marginRight: '4px' }} />
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleBack}
                                style={{ display: activeStep === profileType.length ? 'flex' : 'none' }}
                            ><EditIcon style={{ marginRight: '4px' }} />
                                Edit
                            </Button>
                            <Button variant="contained" onClick={saveDetails} style={{ display: activeStep === profileType.length ? 'none' : 'flex' }}>
                                {activeStep === profileType.length - 1 && <SaveIcon style={{ marginRight: '10px' }} />}
                                {activeStep === profileType.length - 1 ? 'Finish' : 'Next'}
                                {activeStep < profileType.length - 1 && <NavigateNextIcon style={{ marginLeft: '4px' }} />}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>);
}

export default Profile;