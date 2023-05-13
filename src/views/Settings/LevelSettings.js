import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { beforeSettings, updateLevelSettings, getLevelSettings } from './settings.action';
import { connect } from 'react-redux';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import Swal from 'sweetalert2';
var CryptoJS = require("crypto-js");
import validator from 'validator';
import Select from "react-select"

// react-bootstrap components
import {
	Button,
	Card,
	Form,
	Container,
	Row,
	Col,
} from "react-bootstrap";


const LevelSettings = (props) => {

	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [noOfLevels, setNoOfLevels] = useState(1)
	const [settings, setSettings] = useState([
		{
			levelNumber: 0,
			levelName: 0,
			noOfWins: 0,
			noOfStreaks: 0,
			streakType: 0,
			noOfGameStreak: 0,
			winPercentage: 0
		}
	])

	useEffect(() => {
		window.scroll(0, 0)
		setLoader(true);
		props.getLevelSettings()
		let roleEncrypted = localStorage.getItem('role');
		let role = ''
		if (roleEncrypted) {
			let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
		props.getRole(role)
	}, [])

	useEffect(() => {
		if (Object.keys(props.getRoleRes).length > 0) {
			setPermissions(props.getRoleRes.role)
		}
	}, [props.getRoleRes])

	useEffect(() => {
		if (props.settings.levelsettingsAuth) {
			if (props.settings.levelsettings) {
				props.getLevelSettings()
			}
			props.beforeSettings()
		}
	}, [props.settings.levelsettingsAuth])

	useEffect(() => {
		if (props.settings.getlevelsettingsAuth) {
			setLoader(false)
			setSettings(props.settings.levelsettings)
			props.beforeSettings()
		}
	}, [props.settings.getlevelsettingsAuth])
	useEffect(() => {
		// alert('lelaaaa')
	}, [settings])



	const submit = () => {
		let check = true
		const error = {}

		if (check) {
			props.updateLevelSettings(settings)
			setLoader(true)
		}
	}
	const addNewLevel = () => {
		let settings_ = settings
		let levelNumber = settings_.length > 0 ? settings_[settings_.length - 1].levelNumber + 1 : 1
		setSettings([...settings_,
		{
			levelNumber: levelNumber,
			levelName: '',
			noOfWins: 0,
			noOfStreaks: 0,
			streakType: 0,
			noOfGameStreak: 0
		}
		])
	}
	const removeLevel = (index) => {
		Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
				let settings_ = settings
				delete settings_[index]
				settings_ = settings_.filter(setting => setting)
				setSettings(settings_)
            }
        })

	}

	const updateValue = (settingsIndex, key, value) => {
		const settings_ = settings.map((setting, index) => {
			if (settingsIndex === index) {
				// No change
				return {
					...setting,
					[key]: value,
				};
			} else {
				return setting;
				// Return a new circle 50px below
			}
		});
		
		setSettings(settings_)
	}
	return (
		<>
			{
				loader ? <FullPageLoader /> :
					<Container fluid>
						<Row>
							<Col md="12">
								<Form action="" className="form-horizontal" id="TypeValidation" method="">
									<Card className="table-big-boy">
										<Card.Header>
											<div className="d-block d-md-flex align-items-center justify-content-between">
												<Card.Title as="h4">Level Settings</Card.Title>
											</div>
										</Card.Header>

										<Card.Body>
											{settings.map((setting, index) => {
												return (
													<Row key={index} className="form-inline levels-row mb-4">
														<Col xl={3} sm={6}>
															<Form.Group className="d-block">
																{settings.length - 1 == index &&
																	<Form.Label className="d-block mr-3 red" onClick={() => removeLevel(index)}>X</Form.Label>
																}
																<div className="label-holder d-flex justify-content-between align-items-center mb-2">
																	<Form.Label className="d-block mr-3 flex-fill">Level Number</Form.Label>
																	<Form.Control type="number" value={setting.levelNumber} readOnly={true} className="level-number-input"></Form.Control>
																</div>
																<Form.Control className="w-100" type="text" value={setting.levelName} onChange={(e) => { updateValue(index, 'levelName', e.target.value) }} ></Form.Control>
															</Form.Group>
														</Col>
														<Col xl={3} sm={6}>
															<Form.Group className="d-block">
																<div className="label-holder mb-2">
																	<Form.Label className="d-block mr-3">User has to win </Form.Label>
																</div>
																<div className="d-flex align-items-center mb-2">
																	<Form.Control type="number" value={setting.noOfWins} onChange={(e) => { updateValue(index, 'noOfWins', e.target.value) }}></Form.Control>
																	<Form.Label className="d-block ml-2"> games </Form.Label>
																</div>
															</Form.Group>
														</Col>
														<Col xl={2} sm={6}>
															<Form.Group className="d-block">
																<div className="label-holder mb-2">
																	<Form.Label className="d-block mr-3">and will have</Form.Label>
																</div>
																<div className="label-holder d-flex justify-content-between align-items-center mb-2">
																	<Form.Control type="number" value={setting.noOfStreaks} onChange={(e) => { updateValue(index, 'noOfStreaks', e.target.value) }} className="streak-count"></Form.Control>
																	<Form.Control as="select" value={setting.streakType} onChange={(e) => { updateValue(index, 'streakType', e.target.value) }}>
																		<option value="1">Win</option>
																		<option value="0">Loose</option>
																	</Form.Control>
																</div>
															</Form.Group>
														</Col>
														<Col xl={2} sm={6}>
															<Form.Group className="d-block">
																<div className="label-holder mb-2">
																	<Form.Label className="d-block mr-3">streak of </Form.Label>
																</div>
																<div className="label-holder d-flex justify-content-between align-items-center mb-2">
																	<Form.Control type="number" value={setting.noOfGameStreak} onChange={(e) => { updateValue(index, 'noOfGameStreak', e.target.value) }}></Form.Control>
																	<Form.Label className="d-block ml-2"> games </Form.Label>
																</div>
															</Form.Group>
														</Col>
														{
															( setting.streakType === 1 || setting.streakType === "1" ) ?
																<Col xl={2} sm={6} >
																	<Form.Group className="d-block">
																		<div className="label-holder mb-2">
																			<Form.Label className="d-block mr-3">Win% of </Form.Label>
																		</div>
																		<div className="label-holder d-flex justify-content-between align-items-center mb-2">
																			<Form.Control type="number" value={setting.winPercentage} onChange={(e) => { updateValue(index, 'winPercentage', e.target.value <= 20  ? e.target.value : 0 ) }} max={20}></Form.Control>
																			<Form.Label className="d-block ml-2"> games </Form.Label>
																		</div>
																	</Form.Group>
																</Col>
																:
																<></>
														}

													</Row>
												)
											})}
										</Card.Body>
										<Card.Footer>
											<Row >
												<Col sm={6}>
													<Button variant="success" onClick={addNewLevel} className="float-left">Add new</Button>
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

export default connect(mapStateToProps, { beforeSettings, updateLevelSettings, getLevelSettings, getRole })(LevelSettings);
