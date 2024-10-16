import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';

const CustomMoment = ({ messageAt }) => {
  // Chuyển đổi messageAt thành đối tượng Moment
  const messageMoment = moment(messageAt);

  return (
    <div className="post_profile_privacy_date">
      {messageMoment.isSame(moment(), 'day') ? (
        // Nếu là ngày hôm nay, chỉ hiển thị giờ
        <Moment format="h:mm A" interval={30}>
          {messageAt}
        </Moment>
      ) : (
        // Nếu không phải là ngày hôm nay, hiển thị thứ, ngày và giờ
        <Moment format="dddd h:mm A" interval={30}>
          {messageAt}
        </Moment>
      )}
    </div>
  );
};

export default CustomMoment;
