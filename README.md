# netonex
NetONEX/npNetONE 密码控件及示例

## 使用方法:
进入samples下的任意目录, 在浏览器(IE/Firefox/Chrome)中打开index.html文件, 按照指示执行进一步操作.

## 修改记录(Change Log)

##### v1.4.3.0
* 修复了不能new PKCS7SigX而只能通过MainX.CreatePKCS7SigXInstance()构造PKCS7SigX实例的bug;

##### v1.4.2.0
* HashX, 新增SHA-2（SHA256），SM3算法;
* 新增CipherX对象, 支持多种对称加密算法;

##### v1.4.1.0
* 新增PKCS7SigX对象, 支持PKCS7签名的解析，验证

##### v1.4.0.0
* 基础库升级，修复了存在了很长时间的SM2证书PKCS7 Attach/Detach参数效果颠倒的问题。期望Attached，结果是Detached；期望Deteched，结果是Attached。（RSA证书没有这个问题）

##### v1.3.9.0
* 基础库升级，修复了一个sm2数字信封解包的bug
* CertificateCollectionX::CreateCertificateFile参数有变化，支持同时加载私钥文件。

##### v1.3.8.3
* 修复SKF PIN输入框输入PIN长度不能超过31个字符的bug

##### v1.3.8.2
* CertificateX：新增VerifyPIN()

##### v1.3.8.1
* CertificateX.DefaultCipher，不论SKF/CSP接口，缺省均为sm4-cbc

##### v1.3.8.0-1
* 修复CSP模式下更新双证书时加密证书被更新成签名证书的问题。
* 修复CertificateX.EnvOpen在用户取消私钥操作情况下(例如在输入PIN的对话框选择取消），依然有数据返回的问题。
* 基础库升级。更好的SKF驱动兼容性
* ISKFEnrollX, ICSPEnrollX新增GenerateCSR，KeyExists方法，以及NewCSR属性

##### v1.3.6.2-1
* 代码签名使用sha256证书，Windows XP用户需要升级到sp3以上

##### v1.3.6.0-1
* 新增对象ISKFTokenCollectionX，可用于加载搜索SKF设备
* 修复了v1.3.5.0无法在windows xp下注册运行的bug

##### v1.3.5.0-1
* ICertificateX新增XMLSignEnveloping和XMLSign方法，可用于XML签名
* NetONE/npNetONE控件的体积增加了将近1倍，原因在于XML签名带来的新增代码

##### v1.3.4.0-1
* 导入当前控件和示例代码


