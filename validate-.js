$.validator.addMethod("chinaTel", function (value, element, params) {
	var format = /^(\+?[0-9]{1,3}-?)?(0[0-9]{2,3}-?)?([2-9][0-9\-]{5,8})+(-?[0-9]{1,4})?$/;
	var tel400_800 = /^(\+?[0-9]{1,3}-?)?(400|800)-?([0-9\-]{5,9}[0-9]{1})$/
	return this.optional(element) || (format.test(value.trim()) || tel400_800.test( value.trim() ) );
}, nst.lang.invalidTel[lang]);

$.validator.addMethod("chinaMobile", function (value, element, params) {
	//手机有效性验证  130-139开头都有，15开头的号码没有154，18开头没有1，4，5，14开头
	var format = /^(\+?[0-9]{1,3}-?)?0?(13[0-9]|15[0-35-9]|18[0236789]|14[57])([0-9\-]{7,9})[0-9]{1}$/;
	return this.optional(element) || format.test(value.trim());
}, nst.lang.invalidMobile[lang]);