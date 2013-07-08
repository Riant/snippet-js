<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@ taglib prefix="s" uri="/struts-tags"%>
 <%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title></title>
	<link rel="stylesheet" href="<%=basePath%>/pages/skin/css/skin.css" />
</head>
<body>
	<div class="pageSystemError">
		<div class="page404-txt">
			非常抱歉!<br/>
			系统出现异常.
		</div>
		<div class="page404-btn">
			<a class="button-404" href="../index.jsp#index" ><span>返回</span></a>
		</div>
	</div>
</body>
</html>
 