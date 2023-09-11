import React from 'react';
// import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { toAbsoluteUrl } from '../../utils';
import { useNavigate } from 'react-router-dom';
import './MyProfile.scss';
import Card from '../../components/common/Card';


const MyProfile = () => {

	const navigate = useNavigate();

	return (
		<>
			<div className='myprofile'>
				<Card className='profile-detail'>
					<div className='profile-img'>
						<figure>
							<img src={toAbsoluteUrl('../images/person-img.png')} alt="person-img" />
						</figure>
					</div>
					<div className='desc'>
						<h3>John doe</h3>
						<p><a href="mailTo: johndoe@gmail.com" className='link'>johndoe@gmail.com</a></p>
						<p><a href="tel: (302) 988-4832" className='link'>(302) 988-4832</a></p>
						<Button type="primary" onClick={() => navigate('/mypatients/add')}> Edit profile </Button>
					</div>
				</Card>
			</div>
		</>
	);
}

export default MyProfile;
