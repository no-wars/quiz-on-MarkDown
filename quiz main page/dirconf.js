const dirConfig = [
  {
    "name": "BSD",
    "color": "linear-gradient(45deg, #ff0000, #0BCE0B)",
    "icon": {
      "type": "img",
      "src": "https://vigneshwaranravichandran.wordpress.com/wp-content/uploads/2017/07/freebsd-logo-256x256.png"
    },
    "levels": [
      {
        "name": "დამწყები",
        "link": "math/beginner/"
      },
      {
        "name": "საშუალო",
        "link": "math/intermediate/"
      },
      {
        "name": "რთული",
        "link": "math/advanced/"
      }
    ],
    "position": 2,
    "status": "show",
    "colorEnd": "#0BCE0B",
    "colorStart": "#6f42c1"
  },
  {
    "name": "Linux",
    "color": "linear-gradient(45deg, #EDA242, #ffffff)",
    "icon": {
      "type": "img",
      "src": "https://cdn-icons-png.flaticon.com/512/518/518713.png"
    },
    "levels": [
      {
        "name": "დამწყები",
        "link": "programming/beginner/"
      },
      {
        "name": "საშუალო",
        "link": "programming/intermediate/"
      },
      {
        "name": "რთული",
        "link": "programming/advanced/"
      }
    ],
    "position": 1,
    "status": "show",
    "colorStart": "#EDA242",
    "colorEnd": "#ffffff"
  },
  {
    "name": "Windows",
    "color": "#198754",
    "icon": {
      "type": "img",
      "src": "https://icons.iconarchive.com/icons/martz90/circle/256/windows-8-icon.png"
    },
    "levels": [
      {
        "name": "დამწყები",
        "link": "history/beginner/"
      },
      {
        "name": "საშუალო",
        "link": "history/intermediate/"
      },
      {
        "name": "რთული",
        "link": "history/advanced/"
      }
    ],
    "position": 3,
    "status": "show",
    "colorStart": "#6f42c1",
    "colorEnd": "#ffffff"
  },
  {
    "name": "Mac os",
    "color": "#c0bfbc",
    "icon": {
      "type": "img",
      "src": "https://cdn.jim-nielsen.com/macos/512/macos-catalina-2019-10-08.png?rf=1024"
    },
    "levels": [
      {
        "name": "დამწყები",
        "link": ""
      },
      {
        "name": "საშუალო",
        "link": ""
      },
      {
        "name": "რთული",
        "link": ""
      }
    ],
    "position": 4,
    "status": "show",
    "colorStart": "#6f42c1",
    "colorEnd": "#ffffff"
  },
  {
    "name": "raspberry pi",
    "color": "linear-gradient(45deg, #1D5B1D, #1D5B1D)",
    "icon": {
      "type": "img",
      "src": "https://camo.githubusercontent.com/301d35c4fd5628d173333b4824a5648842408cee5cb545f8069c408e280bbabd/68747470733a2f2f63646e332e69636f6e66696e6465722e636f6d2f646174612f69636f6e732f6c6f676f732d616e642d6272616e64732d61646f62652f3531322f3237325f5261737062657272795f50692d3531322e706e67"
    },
    "levels": [
      {
        "name": "დამწყები",
        "link": ""
      },
      {
        "name": "საშუალო",
        "link": ""
      },
      {
        "name": "რთული",
        "link": ""
      }
    ],
    "position": 5,
    "status": "show",
    "colorStart": "#1D5B1D",
    "colorEnd": "#1D5B1D"
  }
];

dirConfig.sort((a, b) => (a.position || 0) - (b.position || 0));
