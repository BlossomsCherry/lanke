export const storage = (addr, data) => {
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(
      plus.io.PRIVATE_DOC, // 程序公用文档目录常量
      fs => {
        // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
        fs.root.getFile(
          plus.io.convertLocalFileSystemURL(addr),
          {
            create: true // 文件不存在则创建
          },
          fileEntry => {
            // 文件在手机中的路径
            //console.log(fileEntry.fullPath)
            fileEntry.createWriter(writer => {
              // 写入文件成功完成的回调函数
              // 向文件中写入数据
              writer.write(JSON.stringify(data))
              writer.onwrite = e => {
                resolve(e.target.fileName)
              }
            })
          },
          e => {
            console.log('getFile failed: ' + e.message)
            reject(e)
          }
        )
      },
      e => {
        console.log(e.message)
      }
    )
  })
}


export const read = addr => {
  let that = this
  return new Promise((resolve, reject) => {
	if(false && uni.$store.state.platform == 'android'){
		console.log('33333343333333')
		const filePath = plus.io.convertLocalFileSystemURL(addr);
		const fileInputStream = plus.android.newObject("java.io.FileInputStream", filePath);
		const inputStreamReader = plus.android.newObject("java.io.InputStreamReader", fileInputStream,'UTF-8');
		const bufferedReader = plus.android.newObject("java.io.BufferedReader", inputStreamReader );
		let str = '';
		let temp = '';
		while ((temp = plus.android.invoke(bufferedReader, 'readLine')) != null) {
			str += temp ;
		}
		plus.android.invoke(bufferedReader, 'close');
		console.log(str)
		resolve(str);
	}else{
		plus.io.requestFileSystem(
		  plus.io.PRIVATE_DOC,
		  fs => {
		    fs.root.getFile(
		      plus.io.convertLocalFileSystemURL(addr),
		      {
		        create: false
		      },
		      fileEntry => {
		        fileEntry.file(function(file) {
		          console.log('文件大小:' + file.size + '-- 文件名:' + file.name)
		          //创建读取文件对象
		          let fileReader = new plus.io.FileReader()
		          //以文本格式读取文件数据内容
		          fileReader.readAsText(file)
		          //文件读取操作完成时的回调函数
		          fileReader.onloadend = function(evt) {
		            resolve(evt.target.result)
		            //console.log("提取的服务器地址:", sURL);
		          }
		        })
		      },
		      e => {
		        reject(e)
		        console.log(e)
		      }
		    )
		  },
		  e => {
		    reject(e)
		    console.log(e.message)
		  }
		)
	}
  })
}