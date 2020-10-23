# netonex
NetONEX/npNetONE 密码控件及示例

## 使用方法:
进入samples下的任意目录, 在浏览器(IE/Firefox/Chrome)中打开index.html文件, 按照指示执行进一步操作.

## 修改记录(Change Log)

##### v1.4.9.2
* 提高XMLSigX对XML格式的容错度

##### v1.4.9.1
* 解决CertificateX.XMLSign对包含中文的XML签名失败的bug

##### v1.4.9.0
* 新增控件模块XMLSigX，用于XML验签

##### v1.4.8.9
* 修复了1个在Windows XP下运行时SVSClientX, TSAClientX, PCSClientX中的bug

##### v1.4.8.8
* SVSClientX, TSAClientX, PCSClientX新增ServerSSL属性，当ServerSSL=1的时候，上述控件将使用SSL方式连接服务器。
* 由于经常出现key厂商新旧SKF驱动混用出现冲突，SKF_EnumDev可以枚举到设备，但是SKF_ConnectDev失败的现象，应客户需要，在遭遇打开SKF设备错误时，不再通过消息框发出提醒。
* SSLClientX，如果服务端要求双向认证，而事先未设置PreferredCertificate，将自动出现证书选择对话框，供用户选择证书；
* 由于PROV_RSA_FULL不支持SHA2，当使用来自PROV_RSA_FULL的CSP证书的时候，SSLClientX将不支持TLSv1.2。由于以上原因，建议Key厂商驱动在注册证书时，如果支持SHA2，请将证书注册为来自PROV_RSA_AES，这样在使用该证书的时候，SSLClientX将可以支持TLSv1.2

##### v1.4.8.5
* SSLClientX新增ConnectSocket方法，使用方法参考vc范例中的SSLclient2()
* SSLClientX修复了一个Shutdown后存在CLOSE_WAIT的bug
* SSLClientX修复了一个读(Read)失败情况下处理的bug

##### v1.4.8.2
* SKFEnrollX, CSPEnrollX新增GenerateP10方法, 可以根据输入的XML定义生成CSR
* 新增控件模块FileX，用于简化网页应用开发
* SSLClientX新增属性TimeoutConnect，TimeoutRead，TimeoutWrite
* 所有控件的LastError可以设置为0，也只能设置为0. 设置LastError=0将清除原先的ErrorString和LastError。可以用来在执行某些操作前设置LastError=0，在执行完成后检查LastError!=0

##### v1.4.7.0
* 修复了一个CertificateCollectionX获取证书后double free的bug 
* 提高CertificateX.SKFSeal/SKFOpen的兼容性
* 代码重构，消除内存泄漏

##### v1.4.6.1
* 修复PKCS7SigX加载支持算法的bug
* CertificateX，新增SKFSeal，SKFOpen，SKFSealFile，SKFOpenFile。使用SKF规范Session密钥，具体实现依赖厂商底层驱动. 
* SKFOpen, SKFOpenFile只支持SKF接口的CertificateX实例（CryptoInterfaceName=="SKF"） 
* SKFSeal, SKFSealFile支持SKF，SFT，CSP接口的CertificateX实例，但是用来封包的证书公钥必须对应SKF接口的解密私钥。

##### v1.4.5.1
* TSAClientX.TSACreate, 第一个参数从byref改成byval，跟其它api一致; 
* TSAClientX.TSACreate, 内部使用SFTHash代替CSPHash，降低使用时的权限要求，例如在IIS后台运行; 
* DEBUG属性的作用发生变化。当DEBUG设置成1的时候，仅在错误信息中增加调试信息，不主动触发MessageBox。是否触发MessageBox由Quiet属性决定；

##### v1.4.4.0
* 修复了不能new TSAResponseX而只能通过MainX.CreateTSAResponseXInstance()构造TSAResponseX实例的bug; 
* SSLClientX, 新增PeerCertificate，CipherInfo属性

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


