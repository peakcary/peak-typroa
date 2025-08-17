  逻辑梳理确认 ✅

  1. 获取appId ✅ - 前端写死 cli_a80e6f280e3b500c
  2. 获取授权码 ✅ - h5sdk.ready() + tt.requestAccess() 获取code
  3. 获取openID ✅ - code传给 /api/isv/feishu/getuserinfo 获取openID
  4. 判断登录态 ✅ - 检查 window.ZAI?.user?.isLogin
  5. 尝试登录 ✅ - 调用 /api/user/fsreglogin 传 {openID}
  6. 处理结果 ✅ - 成功跳转，3001错误显示绑定界面
  7. 用户绑定 ✅ - 手机号+验证码+邀请码，调用 fsreglogin 传 {openID, isBinding:1, mobile, code, referrerPin}