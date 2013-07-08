<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
 <%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<link rel="stylesheet" href="<%=basePath%>resources/css/module.css" />
</head>
<body>
	<div class="page404">
		<div class="page404-txt">
			非常抱歉<br/>
			您查看的页面不存在.
		</div>
		<div class="page404-btn">
			<a class="button-404" href="index.action"><span>返回</span></a>
		</div>
	</div>
</body>
</html>
