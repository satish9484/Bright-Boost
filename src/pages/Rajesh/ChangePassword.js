import React from 'react';
import { Button, Form, Input } from 'antd';
import './MyProfile.scss';
import Card from '../../components/common/Card';


const ChangePassword = () => {

  return (
    <>
      <div className='changepassword'>
        <Card className='profile-detail edit'>
          <Form
            className='changeform'
            layout="vertical"
          >

            <div className='row row-1'>
              <div className='col-md-6 col-md-6-1'>
                <Form.Item
                  className='form-group'
                  label="Old passoword"
                  labelWrap={true}
                  name="Old passoword"
                >
                  <Input type={'password'} />
                </Form.Item>
              </div>
              <div className='col-md-6 col-md-6-1'>
                <Form.Item
                  className='form-group'
                  label="New password"
                  name="New password"
                >
                  <Input type={'password'} />
                </Form.Item>
              </div>
              <div className='col-md-6 col-md-6-1'>
                <Form.Item
                  className='form-group'
                  label="Repeat new password"
                  name="Repeat new password"
                >
                  <Input type={'password'} />
                </Form.Item>
              </div>
              <div className='col-md-6 col-md-6-1 mar-top-8'>
                <Form.Item className='form-group changepassword-button-root'>
                  <Button className='changepassword-save' type="primary" htmlType="submit"> Save changes</Button>
                  <Button type="primary" htmlType="submit" className='btn-secondary changepassword-cancel' >Cancel</Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      </div>

    </>
  );
}

export default ChangePassword;
