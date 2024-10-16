import axios from "axios";
export const createNotification = async (
  receiverId,
  type,
  postId,
  commentId,
  link,
  description,
  token
) => {
  try {
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/createNotification`,
      {
        receiverId,
        type,
        postId,
        commentId,
        link,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const setRead = async (idNotification, token) => {
  try {
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/setRead/${idNotification}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
