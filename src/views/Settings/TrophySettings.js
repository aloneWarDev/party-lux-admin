import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { beforeSettings, getTrophySettings, updateTrophySettings} from './settings.action';
import { connect } from 'react-redux';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
var CryptoJS = require("crypto-js");

// react-bootstrap components
import {
	Button,
	Card,
	Form,
	Container,
	Row,
	Col,
} from "react-bootstrap";


const TrophySettings = (props) => {

	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [noOfLevels, setNoOfLevels] = useState(1)
	const [settings, setSettings] = useState([
		{
			trophyName: '',
			type: 0,			//0: Platform joined 1: win Streaks 2: loose Streaks 3: Friend Socializing
			typeCount: 0,
			streakCount: 0,
			friendCount: 0
		}
	])
	
	useEffect(() => {
		window.scroll(0, 0)
		setLoader(true);
		props.getTrophySettings()
		let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        props.getRole(role)
	}, [])

	useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])

	useEffect(() => {
		if (props.settings.trophysettingsAuth) {
			if (props.settings.trophysettings) {
				props.getTrophySettings()
			}
			props.beforeSettings()
		}
	}, [props.settings.trophysettingsAuth])

	useEffect(() => {
		if (props.settings.gettrophysettingsAuth) {
			setLoader(false)
			setSettings(props.settings.trophysettings)
			props.beforeSettings()
		}
	}, [props.settings.gettrophysettingsAuth])

	const submit = () => {
		let check = true
		
		if(check){
			props.updateTrophySettings(settings)
			setLoader(true)
		}
	}
	const addNewTrophy = () => {
		let settings_ = settings
		setSettings([...settings_,
			{
				name: '',
				type: 0,		//0: Platform joined 1: win Streaks 2: loose Streaks 3: Friend Socializing
				typeCount: 0,
				streakCount: 0,
				friendCount: 0
			}
		])	
	}
	const removeTrophy = (index) => {
		let settings_ = settings
		delete settings_[index]
		settings_ = settings_.filter(setting => setting)
		setSettings(settings_)	
	}

	const updateValue = (settingsIndex, key, value ) => {
		const settings_ = settings.map((setting, index) => {
			if (settingsIndex === index) {
			  return {
				...setting,
				[key]: value,
			  };
			} else {
				return setting;
			}
		  });
		setSettings(settings_)
	}
	return (
		<>
			{
				!loader ? <FullPageLoader/> :
				<Container fluid>
					<Row>
						<Col md="12">
							<Form action="" className="form-horizontal" id="TypeValidation" method="">
								<Card className="table-big-boy">
									<Card.Header>
										<div className="d-block d-md-flex align-items-center justify-content-between">
											<Card.Title as="h4">Trophy Settings</Card.Title>
										</div>
									</Card.Header>

									<Card.Body>
										{/* <Row  className="form-inline levels-row mb-4"> */}
										{settings.map((setting, index) => {
											return(
												<Row key={index} className="levels-row mb-4">
													<Col xl={3} sm={3}>
														<Form.Group>
															<Form.Label className="d-block mr-3 red float-left remove-btn" onClick={() => removeTrophy(index)}>X</Form.Label>
															<Form.Label className="d-block mr-3">Trophy Name</Form.Label>
															<Form.Control type="text" value={setting.name} onChange={(e) => { updateValue(index, 'name', e.target.value) }} ></Form.Control>
														</Form.Group>
													</Col>
													<Col xl={2} sm={2}>
														<Form.Group>
															<Form.Label className="d-block mr-3">Trophy Type</Form.Label>
															<Form.Control as="select" value={setting.type} onChange={(e ) => { updateValue(index, 'type', e.target.value) }}>
																<option value="">Select Type</option>
																<option value="0">New Joiner</option>
																<option value="1">Win Streak</option>
																<option value="2">Loose Streak</option>
																<option value="3">Friend Socializer</option>
															</Form.Control>
														</Form.Group>
													</Col>
													{(setting.type == '1' || setting.type == '2') &&
														<>
															<Col xl={3} sm={3}>
																<Form.Group>
																	<Form.Label className="d-block mr-3">No of {setting.type == 1 ? 'Wins' : 'Loose'}</Form.Label>
																	<Form.Control type="text" value={setting.typeCount} onChange={(e) => { updateValue(index, 'typeCount', e.target.value) }} ></Form.Control>
																</Form.Group>
															</Col>
															<Col xl={3} sm={3}>
																<Form.Group>
																	<Form.Label className="d-block mr-3">No of streaks</Form.Label>
																	<Form.Control type="text" value={setting.streakCount} onChange={(e) => { updateValue(index, 'streakCount', e.target.value) }} ></Form.Control>
																</Form.Group>
															</Col>
														</>
													}
													{setting.type == '3' &&
														<Col xl={3} sm={3}>
															<Form.Group>
																<Form.Label className="d-block mr-3">No of Friends</Form.Label>
																<Form.Control type="number" value={setting.friendCount} onChange={(e) => { updateValue(index, 'friendCount', e.target.value) }} ></Form.Control>
															</Form.Group>
														</Col>
													}
													
												</Row>
											)
										})}
									</Card.Body>
									<Card.Footer>
										<Row >
											<Col sm={6}>
												<Button variant="info" onClick={addNewTrophy} className="float-left">Add new</Button>
											</Col>
											{
												permissions && permissions.editSetting &&
													<Col sm={6}>
														<Button variant="info" onClick={submit} className="float-right">Save</Button>
													</Col>
											}
										</Row>
									</Card.Footer>
								</Card>
							</Form>
						</Col>
					</Row>
				</Container>
			}
		</>
	);
}

const mapStateToProps = state => ({
	settings: state.settings,
	error: state.error,
	getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { beforeSettings, getTrophySettings, updateTrophySettings, getRole })(TrophySettings);
