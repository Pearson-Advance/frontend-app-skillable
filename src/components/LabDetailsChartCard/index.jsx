import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@edx/paragon';
import './index.scss';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const LabDetailsChartCard = ({ details }) => {
  const {
    NumTasks,
    NumCompletedTasks,
    ExamMaxPossibleScore,
    ExamScore,
  } = details;

  const gaugeSettings = {
    width: 100,
    height: 100,
    cornerRadius: '50%',
    sx: (theme, fill) => ({
      [`& .${gaugeClasses.valueText}`]: {
        fontSize: 20,
      },
      [`& .${gaugeClasses.valueArc}`]: {
        fill,
      },
      [`& .${gaugeClasses.referenceArc}`]: {
        fill: '#F0F0F0',
      },
    }),
  };

  return (
    <div className="lab-details-chard-card">
      <Card className="mb-2">
        <Card.Body>
          <div className="lab-details">
            <div className="lab-details-row chart-card-row">
              <div className="lab-details-item">
                <strong>NUMBER OF TASKS</strong>
                <span>{NumTasks}</span>
              </div>
              <div className="lab-details-item">
                <strong>COMPLETED TASKS</strong>
                <span>{NumCompletedTasks}</span>
              </div>
            </div>
            <div className="lab-details-row chart-card-row">
              <div className="lab-details-item">
                <Gauge
                  {...gaugeSettings}
                  value={NumCompletedTasks}
                  valueMax={NumTasks}
                  sx={(theme) => gaugeSettings.sx(theme, '#FFD322')}
                />
                <strong>COMPLETED TASKS</strong>
              </div>
              <div className="lab-details-item">
                <Gauge
                  {...gaugeSettings}
                  value={ExamScore}
                  valueMax={ExamMaxPossibleScore}
                  sx={(theme) => gaugeSettings.sx(theme, '#71CCCF')}
                />
                <strong>SCORE</strong>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

LabDetailsChartCard.defaultProps = {
  details: {
    NumTasks: 0,
    NumCompletedTasks: 0,
    ExamMaxPossibleScore: 0,
    ExamScore: 0,
  },
};

LabDetailsChartCard.propTypes = {
  details: PropTypes.objectOf(PropTypes.string),
};

export default LabDetailsChartCard;
