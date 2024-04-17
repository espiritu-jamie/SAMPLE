
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Radio, Select, Divider, Collapse } from 'antd';
import Layout from '../../components/Layout';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment'; 
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import SubmitAvailability from '../../components/SubmitAvailability'; 

const { Option } = Select;
const { Panel } = Collapse;

const EmployeeAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [viewMode, setViewMode] = useState('list'); 

  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/availability', { headers });
      setAvailabilities(response.data.data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const formatTime = (time) => {
    return moment(time, 'HH:mm').format('hh:mm A');
  };

  const formatDateWithDayOfWeek = (date) => {
    return moment.utc(date).format('dddd, MMMM Do YYYY');
  };

  const handleDelete = (availabilityId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this availability?',
      onOk() {
        deleteAvailability(availabilityId);
      },
    });
  };

  const deleteAvailability = async (availabilityId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`/api/availability/${availabilityId}`, { headers });
      fetchAvailabilities();
    } catch (error) {
      console.error('Error deleting availability:', error);
      Modal.error({
        title: 'An error occurred while deleting the availability',
        content: 'Something went wrong. Please try again later.',
      });
    }
  };

  const onEventClick = (clickInfo) => {
    const availability = availabilities.find(a => a._id === clickInfo.event.id);
    setSelectedAvailability(availability);
    setIsDetailModalVisible(true); 
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedAvailability(null); 
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => formatDateWithDayOfWeek(record.date),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (text) => formatTime(text),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (text) => formatTime(text),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger>
          Delete
        </Button>
      ),
    },
  ];
  


  return (
    <Layout>
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <Collapse defaultActiveKey={[]}>
          <Panel header="Add Availability" key="1">
        <SubmitAvailability onAvailabilitySubmitted={fetchAvailabilities} />
        </Panel>
        </Collapse>

      <Divider />

      <Modal
        title="Availability Details"
        open={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={[
          <Button key="back" onClick={closeDetailModal}>
            Close
          </Button>,
          <Button key="delete" type="primary" danger onClick={() => {
            handleDelete(selectedAvailability._id);
            closeDetailModal();
          }}>
            Delete Availability
          </Button>,
        ]}
      >
        {selectedAvailability && (
          <div>
            <p>Date: {formatDateWithDayOfWeek(selectedAvailability.date)}</p>
            <p>Start Time: {formatTime(selectedAvailability.starttime)}</p>
            <p>End Time: {formatTime(selectedAvailability.endtime)}</p>
          </div>
        )}
      </Modal>
      
      <Collapse defaultActiveKey={[]}>
        <Panel header="My Availability" key="2">
          <Radio.Group
            defaultValue="list"
            buttonStyle=""
            onChange={(e) => setViewMode(e.target.value)}
            style={{ marginBottom: 20 }}
          >
            <Radio.Button value="list">List View</Radio.Button>
            <Radio.Button value="calendar">Calendar View</Radio.Button>
          </Radio.Group>
          {viewMode === 'list' ? (
          <Table dataSource={availabilities} columns={columns} rowKey="_id" />
        ) : (
          
          <FullCalendar
            aspectRatio={1.5}
            contentHeight="auto"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            timeZone="UTC" 
            events={availabilities.map((availability) => ({
              id: availability._id,
              title: `Available: ${moment(availability.starttime, 'HH:mm').format('hh:mm A')} - ${moment(availability.endtime, 'HH:mm').format('hh:mm A')}`,
              start: moment.utc(availability.date).startOf('day').add(moment.duration(availability.starttime)).toISOString(),
              end: moment.utc(availability.date).startOf('day').add(moment.duration(availability.endtime)).toISOString(),
            }))}
            eventClick={onEventClick} 
          />
        )}
        </Panel>
        </Collapse>
      </div>
    </Layout>
  );
};

export default EmployeeAvailabilities;
