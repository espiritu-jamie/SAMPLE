// import { DatePicker, TimePicker, message, Input, InputNumber, Button, Form, Card, Radio } from 'antd';
// import axios from 'axios';
// import React, { useState } from 'react';
// import Layout from '../../components/Layout';

// const BookingPage = () => {
//   const [form] = Form.useForm();
//   const [cost, setCost] = useState(0); // Store the calculated cost

//   // Constant for cost per square foot
//   const COST_PER_SQFT = 0.10;

//   const handleSubmit = async (values) => {
//     const { date, starttime, endtime, phoneNumber, address, specialInstructions, area, paymentMethod } = values;
//     const calculatedCost = area * COST_PER_SQFT;
    
//     try {
//       const response = await axios.post(
//         '/api/appointment/',
//         {
//           date: date.format('YYYY-MM-DD'),
//           starttime: starttime.format('HH:mm'),
//           endtime: endtime.format('HH:mm'),
//           phoneNumber,
//           address,
//           specialInstructions,
//           area,
//           cost: calculatedCost,
//           paymentMethod, // Include the payment method in the request
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         message.success('Appointment submitted successfully');
//         form.resetFields();
//         setCost(0);
//       } else {
//         message.error('Failed to submit appointment.');
//       }
//     } catch (error) {
//       console.error('Error submitting appointment:', error);
//       message.error('Failed to submit appointment. Please try again.');
//     }
//   };

//   return (
//     <Layout>
//       <div className="container" style={{ maxWidth: '600px', margin: 'auto' }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Book Your Appointment</h3>
//         <Card>
//           <Form form={form} layout="vertical" onFinish={handleSubmit}>
//             <Form.Item
//               name="phoneNumber"
//               label="Phone Number"
//               rules={[{ required: true, message: 'Phone number is required' }]}
//             >
//               <Input placeholder="Phone Number" />
//             </Form.Item>
//             <Form.Item
//               name="address"
//               label="Address"
//               rules={[{ required: true, message: 'Address is required' }]}
//             >
//               <Input placeholder="Address" />
//             </Form.Item>
//             <Form.Item
//               name="specialInstructions"
//               label="Special Instructions (optional)"
//             >
//               <Input.TextArea rows={4} placeholder="Special Instructions" />
//             </Form.Item>
//             <Form.Item
//               name="area"
//               label="Enter the Area you want to get cleaned (in sqft)"
//               rules={[{ required: true, message: 'Area is required' }]}
//             >
//               <InputNumber
//                 placeholder="Enter the Area in sqft"
//                 min={1}
//                 style={{ width: '100%' }}
//                 onChange={(value) => setCost(value * COST_PER_SQFT)}
//               />
//             </Form.Item>
//             <Form.Item
//               name="date"
//               label="Date"
//               rules={[{ required: true, message: 'Date is required' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
//             </Form.Item>
//             <Form.Item
//               name="starttime"
//               label="Start Time"
//               rules={[{ required: true, message: 'Start time is required' }]}
//             >
//               <TimePicker style={{ width: '100%' }} format="HH:mm" />
//             </Form.Item>
//             <Form.Item
//               name="endtime"
//               label="End Time"
//               rules={[{ required: true, message: 'End time is required' }]}
//             >
//               <TimePicker style={{ width: '100%' }} format="HH:mm" />
//             </Form.Item>
//             <Form.Item
//               name="paymentMethod"
//               label="Select Payment Method"
//               rules={[{ required: true, message: 'Payment method is required' }]}
//             >
//               <Radio.Group>
//                 <Radio value="cheque">Cheque</Radio>
//                 <Radio value="eTransfer">E-Transfer</Radio>
//               </Radio.Group>
//             </Form.Item>
//             <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
//               Approx Cost for Cleaning: ${cost.toFixed(2)}
//             </div>
//             <Form.Item>
//               <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
//                 Submit Appointment
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </div>
//     </Layout>
//   );
//   };


// export default BookingPage;

// import { DatePicker, TimePicker, message, Input, InputNumber, Button, Form, Card, Radio, Steps } from 'antd';
// import axios from 'axios';
// import React, { useState } from 'react';
// import Layout from '../../components/Layout';
// import moment from 'moment';

// const { Step } = Steps;

// const BookingPage = () => {
//   const [form] = Form.useForm();
//   const [currentStep, setCurrentStep] = useState(0); // Track current step
//   const [cost, setCost] = useState(0); // Store the calculated cost
//   const [bookingDetails, setBookingDetails] = useState({});
//   const [personalInfo, setPersonalInfo] = useState({});
//   const [paymentMethod, setPaymentMethod] = useState('');

//   // Constant for cost per square foot
//   const COST_PER_SQFT = 0.10;

//   const handleSubmit = async () => {
//     const formattedData = {
//       ...bookingDetails,
//       ...personalInfo,
//       date: bookingDetails.date ? moment(bookingDetails.date).format('YYYY-MM-DD') : null,
//       starttime: bookingDetails.starttime ? moment(bookingDetails.starttime, "HH:mm").format("HH:mm") : null,
//       endtime: bookingDetails.endtime ? moment(bookingDetails.endtime, "HH:mm").format("HH:mm") : null,
//       cost,
//       paymentMethod,
//     };
  
//     try {
//       const response = await axios.post('/api/appointment/', formattedData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.data.success) {
//         message.success('Appointment submitted successfully');
//         form.resetFields();
//         setCost(0);
//         setCurrentStep(0);
//       } else {
//         message.error('Failed to submit appointment.');
//       }
//     } catch (error) {
//       console.error('Error submitting appointment:', error);
//       message.error('Failed to submit appointment. Please try again.');
//     }
//   };

//   const handleNext = () => {
//     // Handle next button click
//     setCurrentStep(currentStep + 1);
//   };

//   const handleBack = () => {
//     // Handle back button click
//     setCurrentStep(currentStep - 1);
//   };

//   const handleBookingDetailsFinish = (values) => {

//     console.log('Booking details finish:', values);

//     setBookingDetails(values);
//     handleNext();
//   };

//   const handlePersonalInfoFinish = (values) => {

//     console.log('Personal info finish:', values);
//     // Handle personal info form submission
//     setPersonalInfo(values);
//     handleNext();
//   };

//   const handlePaymentMethodChange = (e) => {
//     // Handle payment method change
//     setPaymentMethod(e.target.value);
//   };

//   const steps = [
//     {
//       title: 'Booking Details',
//       content: (
//         <>
//           <Form.Item
//             name="area"
//             label="Enter the Area you want to get cleaned (in sqft)"
//             rules={[{ required: true, message: 'Area is required' }]}
//           >
//             <InputNumber
//               placeholder="Enter the Area in sqft"
//               min={1}
//               style={{ width: '100%' }}
//               onChange={(value) => setCost(value * COST_PER_SQFT)}
//             />
//           </Form.Item>
//           <Form.Item
//             name="date"
//             label="Date"
//             rules={[{ required: true, message: 'Date is required' }]}
//           >
//             <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
//           </Form.Item>
//           <Form.Item
//             name="starttime"
//             label="Start Time"
//             rules={[{ required: true, message: 'Start time is required' }]}
//           >
//             <TimePicker style={{ width: '100%' }} format="HH:mm" />
//           </Form.Item>
//           <Form.Item
//             name="endtime"
//             label="End Time"
//             rules={[{ required: true, message: 'End time is required' }]}
//           >
//             <TimePicker style={{ width: '100%' }} format="HH:mm" />
//           </Form.Item>
//           <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
//             Approx Cost for Cleaning: ${cost.toFixed(2)}
//           </div>
//         </>
//       ),
//       onFinish: handleBookingDetailsFinish,
//     },
//     {
//       title: 'Personal Information',
//       content: (
//         <>
//           <Form.Item
//             name="phoneNumber"
//             label="Phone Number"
//             rules={[{ required: true, message: 'Phone number is required' }]}
//           >
//             <Input placeholder="Phone Number" />
//           </Form.Item>
//           <Form.Item
//             name="address"
//             label="Address"
//             rules={[{ required: true, message: 'Address is required' }]}
//           >
//             <Input placeholder="Address" />
//           </Form.Item>
//           <Form.Item
//             name="specialInstructions"
//             label="Special Instructions (optional)"
//           >
//             <Input.TextArea rows={4} placeholder="Special Instructions" />
//           </Form.Item>
//         </>
//       ),
//       onFinish: handlePersonalInfoFinish,
//     },
//     {
//       title: 'Payment Method',
//       content: (
//         <>
//           <Form.Item
//             name="paymentMethod"
//             label="Select Payment Method"
//             rules={[{ required: true, message: 'Payment method is required' }]}
//           >
//             <Radio.Group onChange={handlePaymentMethodChange}>
//               <Radio value="cheque">Cheque</Radio>
//               <Radio value="eTransfer">E-Transfer</Radio>
//             </Radio.Group>
//           </Form.Item>
//         </>
//       ),
//     },
//     {
//       title: 'Appointment Summary',
//       content: (
//         <>
//           <h3>Appointment Summary</h3>
//           <p><strong>Area:</strong> {bookingDetails.area} sqft</p>
//           <p><strong>Date:</strong> {bookingDetails.date?.format('YYYY-MM-DD')}</p>
//           <p><strong>Start Time:</strong> {bookingDetails.starttime?.format('HH:mm')}</p>
//           <p><strong>End Time:</strong> {bookingDetails.endtime?.format('HH:mm')}</p>
//           <p><strong>Phone Number:</strong> {personalInfo.phoneNumber}</p>
//           <p><strong>Address:</strong> {personalInfo.address}</p>
//           <p><strong>Special Instructions:</strong> {personalInfo.specialInstructions}</p>
//           <p><strong>Payment Method:</strong> {paymentMethod}</p>
//           <p><strong>Approx Cost for Cleaning:</strong> ${cost.toFixed(2)}</p>
//         </>
//       ),
//     },
//   ];

//   return (
//     <Layout>
//       <div className="container" style={{ maxWidth: '1000px', margin: 'auto' }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Book Your Appointment</h3>
//         <Card>
//           <Form form={form} layout="vertical" onFinish={handleSubmit}>
//             <Steps 
//               current={currentStep}
//               style={{marginBottom: '24px'}}>
//               {steps.map((step) => (
//                 <Step key={step.title} title={step.title} />
//               ))}
//             </Steps>
//             <div className="steps-content">{steps[currentStep].content}</div>
//             <div className="steps-action">
//               {currentStep > 0 && (
//                 <Button style={{ margin: '0 8px' }} onClick={handleBack}>
//                   Back
//                 </Button>
//               )}
//               {currentStep < steps.length - 1 && (
//                 <Button type="primary" onClick={handleNext}>
//                   Next
//                 </Button>
//               )}
//               {currentStep === steps.length - 1 && (
//                 <Button type="primary" htmlType="submit">
//                   Submit
//                 </Button>
//               )}
//             </div>
//           </Form>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default BookingPage;

// import React, { useState } from 'react';
// import { Form, Input, InputNumber, Button, Card, DatePicker, TimePicker, Radio, Steps, message } from 'antd';
// import axios from 'axios';
// import Layout from '../../components/Layout';
// import moment from 'moment';

// const { Step } = Steps;

// const BookingPage = () => {
//   const [form] = Form.useForm();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [cost, setCost] = useState(0);

//   // Constant for cost per square foot
//   const COST_PER_SQFT = 0.10;

//   const handleSubmit = async () => {
//     // Format the date and time fields before submission
//     const submitData = {
//       ...formData,
//       date: formData.date.format('YYYY-MM-DD'),
//       starttime: formData.starttime.format('HH:mm'),
//       endtime: formData.endtime.format('HH:mm'),
//       cost,
//     };


//     try {
//       const response = await axios.post('/api/appointment/', submitData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });

//       if (response.data.success) {
//         message.success('Appointment submitted successfully');
//         form.resetFields();
//         setCost(0);
//         setCurrentStep(0);
//       } else {
//         message.error('Failed to submit appointment.');
//       }
//     } catch (error) {
//       console.error('Error submitting appointment:', error);
//       message.error('Failed to submit appointment. Please try again.');
//     }
//   };

//   const onFormChange = (changedValues, allValues) => {
//     console.log("Form changed", { changedValues, allValues });

//     setFormData(allValues);
//     if (changedValues.area) {
//       setCost(changedValues.area * COST_PER_SQFT);
//     }
//   };

//   console.log('formData:', formData);

//   const steps = [
//     {
//       title: 'Booking Details',
//       content: (
//         <>
//           <Form.Item name="area" label="Area (sqft)" rules={[{ required: true, message: 'Please enter the area in sqft' }]}>
//             <InputNumber min={1} placeholder="Enter area in sqft" style={{ width: '100%' }} />
//           </Form.Item>
//           <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select a date' }]}>
//             <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
//           </Form.Item>
//           <Form.Item name="starttime" label="Start Time" rules={[{ required: true, message: 'Please select a start time' }]}>
//             <TimePicker style={{ width: '100%' }} format="HH:mm" />
//           </Form.Item>
//           <Form.Item name="endtime" label="End Time" rules={[{ required: true, message: 'Please select an end time' }]}>
//             <TimePicker style={{ width: '100%' }} format="HH:mm" />
//           </Form.Item>
//           <div>Approx Cost for Cleaning: ${cost.toFixed(2)}</div>
//         </>
//       ),
//     },
//     {
//       title: 'Contact Details',
//       content: (
//         <>
//           <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number' }]}>
//             <Input placeholder="Phone Number" />
//           </Form.Item>
//           <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter your address' }]}>
//             <Input placeholder="Address" />
//           </Form.Item>
//           <Form.Item name="specialInstructions" label="Special Instructions (optional)">
//             <Input.TextArea rows={4} placeholder="Special Instructions" />
//           </Form.Item>
//           <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true, message: 'Please select a payment method' }]}>
//         <Radio.Group>
//           <Radio value="cheque">Cheque</Radio>
//           <Radio value="eTransfer">E-Transfer</Radio>
//         </Radio.Group>
//       </Form.Item>
//         </>
//       ),
//     },
//     {
//       title: 'Summary',
//       content: (
//         <>
//           <p>Area: {formData.area} sqft</p>
//           <p>Date: {formData.date ? moment(formData.date).format('YYYY-MM-DD') : 'N/A'}</p>
//           <p>Start Time: {formData.starttime ? moment(formData.starttime).format('HH:mm') : 'N/A'}</p>
//           <p>End Time: {formData.endtime ? moment(formData.endtime).format('HH:mm') : 'N/A'}</p>
//           <p>Phone Number: {formData.phoneNumber}</p>
//           <p>Address: {formData.address}</p>
//           <p>Special Instructions: {formData.specialInstructions}</p>
//           <p>Payment Method: {formData.paymentMethod}</p>
//           <p>Cost: ${cost.toFixed(2)}</p>
//           <Button type="primary" onClick={handleSubmit}>Confirm and Submit</Button>
//         </>
//       ),
//     },
//   ];

//   const nextStep = () => {
//     setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   return (
//     <Layout>
//       <div className="container" style={{ maxWidth: '600px', margin: 'auto' }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Book Your Appointment</h3>
//         <Card>
//           <Steps current={currentStep}>
//             {steps.map(item => (
//               <Step key={item.title} title={item.title} />
//             ))}
//           </Steps>
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={handleSubmit}
//             onValuesChange={onFormChange}
//             initialValues={formData}
//           >
//             <div className="steps-content">{steps[currentStep].content}</div>
//             <div className="steps-action">
//               {currentStep > 0 && (
//                 <Button style={{ margin: '0 8px' }} onClick={() => prevStep()}>
//                   Previous
//                 </Button>
//               )}
//               {currentStep < steps.length - 1 && (
//                 <Button type="primary" onClick={() => nextStep()}>
//                   Next
//                 </Button>
//               )}
//             </div>
//           </Form>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default BookingPage;


import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Card, DatePicker, TimePicker, Radio, Steps, message, Divider, Typography } from 'antd';
import axios from 'axios';
import Layout from '../../components/Layout';
import moment from 'moment';

const { Title } = Typography;

const BookingPage = () => {
  const [form] = Form.useForm();
  const [cost, setCost] = useState(0); // Store the calculated cost

  // Constant for cost per square foot
  const COST_PER_SQFT = 0.10;

  const handleSubmit = async (values) => {
    const { date, starttime, endtime, phoneNumber, address, specialInstructions, area, paymentMethod } = values;
    const calculatedCost = parseFloat((area * COST_PER_SQFT).toFixed(2)); // Ensures cost is up to 2 decimal places
    
    try {
      const response = await axios.post(
        '/api/appointment/',
        {
          date: date.format('YYYY-MM-DD'),
          starttime: starttime.format('HH:mm'),
          endtime: endtime.format('HH:mm'),
          phoneNumber,
          address,
          specialInstructions,
          area,
          cost: calculatedCost, // Send the formatted cost
          paymentMethod, // Include the payment method in the request
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        message.success('Appointment submitted successfully');
        form.resetFields();
        setCost(0);
      } else {
        message.error('Failed to submit appointment.');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      message.error('Failed to submit appointment. Please try again.');
    }
  };

  const onAreaChange = value => {
    setCost(parseFloat((value * COST_PER_SQFT).toFixed(2)));
  };

  return (
    <Layout>
      <div className="container" style={{ maxWidth: '600px', margin: 'auto', padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Book Your Appointment</Title>
        <Card>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Title level={4}>Contact Information</Title>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Phone number is required' }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Address is required' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item
              name="specialInstructions"
              label="Special Instructions (optional)"
            >
              <Input.TextArea rows={4} placeholder="Special Instructions" />
            </Form.Item>
            <Divider />
            <Title level={4}>Booking Details</Title>
            <Form.Item
              name="area"
              label="Enter the Area you want to get cleaned (in sqft)"
              rules={[{ required: true, message: 'Area is required' }]}
            >
              <InputNumber
                placeholder="Enter the Area in sqft"
                min={1}
                style={{ width: '100%' }}
                onChange={onAreaChange}
              />
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Date is required' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="starttime"
              label="Start Time"
              rules={[{ required: true, message: 'Start time is required' }]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="endtime"
              label="End Time"
              rules={[{ required: true, message: 'End time is required' }]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="paymentMethod"
              label="Select Payment Method"
              rules={[{ required: true, message: 'Payment method is required' }]}
            >
              <Radio.Group>
                <Radio value="cheque">Cheque</Radio>
                <Radio value="eTransfer">E-Transfer</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider />
            <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
              Approx Cost for Cleaning: ${cost.toFixed(2)}
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit Appointment
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default BookingPage;