Mac中配置多个Git账户 （例如：GitHub、Gitee、GitLab）



https://blog.csdn.net/qq_49573472/article/details/122930007





应用场景
将代码托管到github、gitee、gitlab等网站上。

配置步骤
配置多个Git账户主要包括以下步骤：

取消全局配置（若之前全局配置过则需要取消全局配置，否则可跳过）
对每个账户生成各自的秘钥
将私钥添加到本地
对本地秘钥进行配置
将公钥添加到托管网站
使用
1. 取消全局配置
若已经全局配置过Git (即曾经执行过如下命令)

git config --global user.name "xxx" // 配置全局用户名，如Github上注册的用户名
git config --global user.email "xxx@xx.com" // 配置全局邮箱，如Github上配置的邮箱
1
2
这里的 --global 指全局配置 user.name 和 user.email ，即不同的Git仓库默认的用户名和邮箱都是这个值。
由于需要管理多个账户，所以仅使用全局值是不合适的，需要针对每个仓库单独配置。

查看是否已经配置过：

git config --global user.name
git config --global user.email
1
2
如果之前已经配置过，则使用如下命令清除：

git config --global --unset user.name
git config --global --unset user.email
1
2
2. 生成密钥
每个Git账户对应一对密钥

首先，进入保存密钥的目录

cd ~/.ssh
1
然后，根据账户邮箱生成秘钥

ssh-keygen -t rsa -C "xxx@xx.xom"
1
回车后，会有如下提示，输入秘钥文件名，例如：id_rsa_github

Generating public/private rsa key pair.
Enter file in which to save the key (/Users/xx/.ssh/id_rsa):id_rsa_github
1
2
如上提示表示可对生成的秘钥文件进行重命名，默认为 id_rsa 。
由于要配置多个账户，在此需要重命名以区分。例如：重命名为 id_rsa_github 。
设置密码可以直接按回车，直到秘钥生成。
在.ssh秘钥目录下可以看到两个文件 id_rsa_github 和 id_rsa_github.pub。
对于另外的Gitee 或 GitLab 的账户，采用相同的步骤进行生成秘钥 id_rsa_gitee、id_rsa_gitlab 。
成功会显示类似如下内容：

The key fingerprint is:
SHA256:lEmncZqtuXuHgZ4XtkVMkazLaTC5XgN0VLjYi3T8Fk8 xxx@xxx.com
The key s randomart image is:
+---[RSA 2048]----+
|        o o..=+o |
|       . @. + o X|
|        B..B o   |
|       . oB B . E|
|        So X = + |
|        ..* X o .|
|       ..+ O o   |
|        o.* .    |
|        .o .     |
+----[SHA256]-----+
1
2
3
4
5
6
7
8
9
10
11
12
13
14
3. 将私钥添加到本地
ssh-add ~/.ssh/id_rsa_github // 将GitHub私钥添加到本地
ssh-add ~/.ssh/id_rsa_gitee // 将Gitee私钥添加到本地
ssh-add ~/.ssh/id_rsa_gitlab // 将GitLab私钥添加到本地
1
2
3
检验本地是否添加成功：

ssh-add -l
1
4. 对本地秘钥进行配置
由于添加了多个密钥文件，所以需要对这些密钥进行管理。

在.ssh目录下新建一个config文件：

touch config
1
文件中的内容如下：

Host github // 网站的别名，自己取
HostName github.com // 托管网站的域名
User xxx // 托管网站上的用户名
IdentityFile ~/.ssh/id_rsa_github // 使用的密钥文件

// Gitee的配置类似
Host gitee
HostName gitee.com
User xxx
IdentityFile ~/.ssh/id_rsa_gitee

// GitLab的配置类似
Host gitlab
HostName gitlab.com
User xxx
IdentityFile ~/.ssh/id_rsa_gitlab
Port 443 // 可选，端口可能被禁用，若提示端口被禁需要使用其他端口

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
5. 将公钥添加到托管网站
以GitHub为例，先在本地复制公钥，有如下方式可选。

命令行查看并全选复制：

vim id_rsa_github.pub
1
或，执行如下命令拷贝

pbcopy < ~/.ssh/id_rsa_github.pub
1
或，选中访达，点击鼠标右键，选择前往文件夹，输入 ～/.ssh 打开文件夹，打开 id_rsa_github.pub 文件并全选复制。

登录 GitHub，点击右上角头像选择 settings ，在打开的页面中选择 SSH and GPG keys，
点击 New SSH key ，在打开的页面的key输入框粘贴之前复制的公钥，title自己可随意取名，然后点击下方的 Add SSH key 。

测试配置是否成功：

使用网站域名github.com测试

ssh -T git@github.com
1
或使用在config文件中配置的别名github测试

ssh -T git@github
1
6. 使用
两种情况：

从远端拉取代码到本地，
本地已有仓库需要与远程仓库关联。
从远端拉取代码

直接使用 git clone 从远端拉取代码

例如：GitHub上代码库test，选择SSH协议的复制命令，原复制命令为

git clone git@github.com:xxx/test.git
1
如上命令中可使用别名github

git clone git@github:xxx/test.git
1
修改后的代码无需额外配置，可直接push。

本地已有的仓库

本地新建的仓库需要与远端进行关联。

进入本地仓库文件夹，需要单独配置该仓库的用户名和邮箱

git config user.name "xxx"
git config user.email "xxx@xx.com"
1
2
然后，进入本地仓库的git目录，打开config文件
.git目录是隐藏的，ls命令不可见，但是可以直接进入，如果是新建的文件夹需要先执行git init

cd .git // 切换到.git目录
vim config
1
2
在config文件中，点击a修改config文件中已有remote "origin"信息(如果没有就添加remote "origin"信息）

[remote "origin"]
        url = git@gitlab:GuiLiu/test.git
        fetch = +refs/heads/*:refs/remotes/origin/*
1
2
3
修改后按左上角esc退出，输入:wq 保存退出。
主要修改 url 部分，原生信息一般是git@github.com:xxx/test.git，需要将github.com 使用别名 github 代替。
————————————————

                            版权声明：本文为博主原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。

原文链接：https://blog.csdn.net/qq_49573472/article/details/122930007