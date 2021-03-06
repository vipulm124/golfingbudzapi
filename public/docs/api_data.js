define({ "api": [
  {
    "type": "put",
    "url": "/api/request/status",
    "title": "Friend request AACEPT|REJECT|BLOCK|UNBLOCK",
    "description": "<p>Friend request AACEPT|REJECT|BLOCK|UNBLOCK</p>",
    "name": "Friend_request_AACEPT_REJECT_BLOCK_UNBLOCK",
    "group": "FriendRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "friendId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "notificationId",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/friend.api.js",
    "groupTitle": "FriendRequest"
  },
  {
    "type": "post",
    "url": "/api/friend/request",
    "title": "Send friend request",
    "description": "<p>Send friend request</p>",
    "name": "Send_friend_request",
    "group": "FriendRequest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "friendId",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/friend.api.js",
    "groupTitle": "FriendRequest"
  },
  {
    "type": "put",
    "url": "/api/items",
    "title": "Buy an item",
    "description": "<p>Buy an item</p>",
    "name": "Buy_an_item",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Items"
  },
  {
    "type": "get",
    "url": "/api/items",
    "title": "Get all Items for sale",
    "description": "<p>Get all Items for sale</p>",
    "name": "Get_all_Items_for_sale",
    "group": "Items",
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items",
    "title": "Post an item for sale",
    "description": "<p>Post an item for sale</p>",
    "name": "Post_an_item_for_sale",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "price",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userImgUrl",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "image",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/playrequests",
    "title": "Create new playRequest",
    "description": "<p>Create new playRequest</p>",
    "name": "Create_new_playRequest",
    "group": "Play_Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "noOfHoles",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "day",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "venue",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "teeOffTime",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "requestInfo",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "redefineRequest",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "handicap",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "locations",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "industry",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profession",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "gender",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "age",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userImgUrl",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "players",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/playRequest.api.js",
    "groupTitle": "Play_Request"
  },
  {
    "type": "post",
    "url": "/api/users/:id/upcomming/games",
    "title": "Get all upcomming games",
    "description": "<p>Get all upcomming games</p>",
    "name": "Get_all_upcomming_games",
    "group": "Play_Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>(In url) . Id is userId</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/playRequest.api.js",
    "groupTitle": "Play_Request"
  },
  {
    "type": "get",
    "url": "/api/playrequest/search",
    "title": "Search play request by userName",
    "description": "<p>Search play request by userName</p>",
    "name": "Search_play_request_by_userName",
    "group": "Play_Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>. text is query params</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/playRequest.api.js",
    "groupTitle": "Play_Request"
  },
  {
    "type": "post",
    "url": "/api/send/playrequest",
    "title": "Send play request",
    "description": "<p>Send play request</p>",
    "name": "Send_play_requst",
    "group": "Play_Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "requestId",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/playRequest.api.js",
    "groupTitle": "Play_Request"
  },
  {
    "type": "post",
    "url": "/api/register",
    "title": "Add new user",
    "description": "<p>Add new user</p>",
    "name": "Add_new_user",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profileImage",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userType",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "country",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "clubName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "address",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "city",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "subRub",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "operatingHours",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "deviceType",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "imeiNo",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "deviceId",
            "description": "<p>(In body)(device id id fcm push key)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "/api/changepassword",
    "title": "Change Password",
    "description": "<p>Change Password</p>",
    "name": "Change_Password",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newPassword",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/api/forgotpassword",
    "title": "Forgot Password",
    "description": "<p>Forgot Password</p>",
    "name": "Forgot_Password",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/api/users/:id/clubs",
    "title": "Get All club of an Users",
    "description": "<p>Get All club of an Users</p>",
    "name": "Get_All_club_of_an_Users",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>(In body) . id is userId</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/api/users/:id",
    "title": "Get User profile",
    "description": "<p>Get User profile</p>",
    "name": "Get_User_profile",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>(In url)  . Id is userId</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/api/clubs",
    "title": "Get all club",
    "description": "<p>Get all club</p>",
    "name": "Get_all_club",
    "group": "Users",
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/api/clubs/:id/members",
    "title": "Get all member of an club",
    "description": "<p>Get all member of an club</p>",
    "name": "Get_all_member_of_an_club",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>(In body) . id is userId</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/api/users",
    "title": "Get all user",
    "description": "<p>Get all user</p>",
    "name": "Get_all_user",
    "group": "Users",
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/api/clubs/join",
    "title": "Join club",
    "description": "<p>Join club</p>",
    "name": "Join_club",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "clubId",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/api/users/:name/search",
    "title": "Search user by name",
    "description": "<p>Search user by name</p>",
    "name": "Search_user_by_name",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>(In url)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "/api/users/:id",
    "title": "Update user profile",
    "description": "<p>Update user profile</p>",
    "name": "Update_user_profile",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>(In url) . id is userid</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profileImage",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "country",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "handicap",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "noOfHandicap",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "strength",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sex",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "affiliated",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "age",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profession",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "roundsPerMonth",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "refer",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "playWithUs",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "playWithOther",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "course",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "location",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "contact",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "clubName",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "address",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "city",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "operatingHours",
            "description": "<p>(In body)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>(In body)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.api.js",
    "groupTitle": "Users"
  }
] });
