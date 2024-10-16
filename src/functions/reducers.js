export function postsReducer(state, action) {
  switch (action.type) {
    case "POSTS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POSTS_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: action.payload,
        error: "",
      };
    case "POSTS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function postReducer(state, action) {
  switch (action.type) {
    case "POSTS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POSTS_SUCCESS":
      return {
        ...state,
        loading: false,
        post: action.payload,
        error: "",
      };
    case "POSTS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function notificationsReducer(state, action) {
  switch (action.type) {
    case "NOTIFICATIONS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        error: "",
      };
    case "NOTIFICATIONS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function profileReducer(state, action) {
  switch (action.type) {
    case "PROFILE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PROFILE_SUCCESS":
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: "",
      };
    case "PROFILE_POSTS":
      return {
        loading: false,
        profile: { ...state.profile, posts: action.payload },
        error: "",
      };
    case "PROFILE_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
export function photosReducer(state, action) {
  switch (action.type) {
    case "PHOTOS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PHOTOS_SUCCESS":
      return {
        ...state,
        loading: false,
        photos: action.payload,
        error: "",
      };
    case "PHOTOS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
export function friendspageByBirthday(state, action) {
  switch (action.type) {
    case "FRIENDS_BY_BIRTHDAY_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FRIENDS_BY_BIRTHDAY_SUCCESS":
      return {
        ...state,
        loading: false,
        dataByBirthday: action.payload,
        error: "",
      };
    case "FRIENDS_BY_BIRTHDAY_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function friendspage(state, action) {
  switch (action.type) {
    case "FRIENDS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FRIENDS_SUCCESS":
      return {
        ...state,
        loading: false,
        dataFriend: action.payload,
        error: "",
      };
    case "FRIENDS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function groupspage(state, action) {
  switch (action.type) {
    case "GROUPS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "GROUPS_SUCCESS":
      return {
        ...state,
        loading: false,
        dataGroups: action.payload,
        error: "",
      };
    case "GROUPS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function groupdiscoverspage(state, action) {
  switch (action.type) {
    case "DISCOVER_GROUPS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "DISCOVER_GROUPS_SUCCESS":
      return {
        ...state,
        loading: false,
        dataDiscoverGroups: action.payload,
        error: "",
      };
    case "DISCOVER_GROUPS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function postgroups(state, action) {
  switch (action.type) {
    case "POST_GROUPS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POST_GROUPS_SUCCESS":
      return {
        ...state,
        loading: false,
        dataPostGroups: action.payload,
        error: "",
      };
    case "POST_GROUPS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function pagegroup(state, action) {
  switch (action.type) {
    case "PAGEGROUP_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PAGEGROUP_SUCCESS":
      return {
        ...state,
        loading: false,
        dataPageGroup: action.payload,
        error: "",
      };
    case "PAGEGROUP_POSTS":
      return {
        loading: false,
        dataPageGroup: {
          ...state.dataPageGroup,
          posts: action.payload,
        },
        error: "",
      };
    case "PAGEGROUP_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}


export function roommess(state, action) {
  switch (action.type) {
    case "ROOM_MESS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "ROOM_MESS_SUCCESS":
      return {
        ...state,
        loading: false,
        dataRoomMess: action.payload,
        error: "",
      };
    case "ROOM_MESS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}


export function submitReportToGroupReducer(state, action) {
  switch (action.type) {
    case "SUBMIT_REPORT_GROUP_REQUEST":
      return { ...state, loadingReportToGroup: true, errorReportToGroup: "" };
    case "SUBMIT_REPORT_GROUP_SUCCESS":
      return {
        ...state,
        loadingReportToGroup: false,
        reportToGroup: action.payload,
        errerrorReportToGroupor: "",
      };
    case "SUBMIT_REPORT_GROUP_ERROR":
      return { ...state, loadingReportToGroup: false, errorReportToGroup: action.payload };

    default:
      return state;
  }
}

export function listMessReducer(state, action) {
  switch (action.type) {
    case "LISTMESS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "LISTMESS_SUCCESS":
      return {
        ...state,
        loading: false,
        listMess: action.payload,
        error: "",
      };
    case "LISTMESS_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export function listPostSavedReducer(state, action) {
  switch (action.type) {
    case "POSTSSAVED_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POSTSSAVED_SUCCESS":
      return {
        ...state,
        loading: false,
        listPostSaved: action.payload,
        error: "",
      };
    case "POSTSSAVED_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
