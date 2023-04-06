const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Write = require("./models/write");
const Ask = require("./models/ask");
const Reply = require("./models/reply");
const R_Reply = require("./models/r_reply");
const Counter = require("./models/counter");
const Counter2 = require("./models/counter2");
const ReplyCounter = require("./models/replycounter");
const R_ReplyCounter = require("./models/r_replycounter");

const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const Verify = require("./models/verify");
const StudyTime = require("./models/studyTime");
const GoalTime = require("./models/goalTime");
const { dblClick } = require("@testing-library/user-event/dist/click");

const OpenStudy = require("./models/openStudy");
//const { default: StudyRoomCard } = require("../component/StudyRoomCard");
const Schedule = require("./models/schedule");

const ObjectId = mongoose.Types.ObjectId;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mysecretkey = "capstone";

mongoose
  .connect(
    "mongodb+srv://admin:password1234@capstone.zymalsv.mongodb.net/capstone?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB 접속완료"))
  .catch((err) => console.log(err));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  //사용자 정보 확인
  app.get("/user", async(req, res) =>{
      const token = req.headers.authorization;
      try{
          const {email} = jwt.verify(token, mysecretkey);
          const user = await User.findOne({email});
          res.json(user);
          //console.log(res.data);
      }catch(err){
          res.status(401).send({message : 'Invalid token'});
      }
  });
  
  //일정 정보 저장
  app.post("/schedules", async(req, res) => {
      const {date, title, contents} = req.body;
      try{
          const newSchedule = new Schedule({
              title: title,
              date: date,
              contents: contents
          });
          await newSchedule.save();
          return res.status(201).json(newSchedule);
      } catch(err){
          console.error(err);
          res.status(500).json({ message: 'Server Error' });
      } 
  });
  
  //저장된 일정 정보 가져오기
  app.get('/schedules', async(req, res) => {
      try{
          const schedules = await Schedule.find();
          return res.status(200).json(schedules);
      }catch(err){
          console.error(err);
          res.status(500).json({message : 'Server Error'})
      }
  });
  
  app.post("/userInfo", async(req,res) => {
      console.log(req.body);
      const {name, email, password} = req.body;
  
  })

app.post("/login", async (req, res) => {
  // 요청 바디에서 email과 password를 추출합니다.
  const { email, password } = req.body;

  // email이 존재하는지 확인합니다.
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "유저를 찾을 수 없습니다." });
  }

  // password가 맞는지 확인합니다.
  const isMatch = user.password === password;
  if (!isMatch) {
    return res.status(401).send({ message: "패스워드가 틀렸습니다." });
  }

  // JWT 토큰을 발행합니다.
  const token = jwt.sign({ id: user._id }, mysecretkey, { expiresIn: "365d" });

  // 토큰을 클라이언트에게 전달합니다.
  res.send({ token: token, name: user.name });
});

app.post("/email-check", async (req, res) => {
  const { email, verify } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({
      name: name,
      email: email,
      password: password,
    });
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/email-send", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email is not exists" });
    }

    const verify = Math.round(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "joi47920@gmail.com",
        pass: "ilgichwnxbjgyamd",
      },
    });

    const mailOptions = {
      from: "joi47920@gamil.com",
      to: email,
      subject: "Link 인증번호 메일입니다.",
      text: `인증번호는 ${verify}입니다.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    /* 유효기간 5분 */
    const now = new Date();
    const verified = new Verify({
      email: email,
      verify: verify,
      expireDate: new Date(now.getTime() + 5 * 60 * 1000),
    });
    verified.save();
    return res.status(200).json({ message: "Email is sended" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/email-verify", async (req, res) => {
  const { email, verify } = req.body;
  try {
    const verified = await Verify.find({
      email: email,
      expireDate: { $gte: new Date() },
    })
      .sort({ expireDate: -1 })
      .limit(1);

    if (!verified) {
      return res
        .status(400)
        .json({ message: "유효시간이 지났거나 존재하지 않습니다." });
    }
    const obj = verified[0];
    if (obj.verify === verify) {
      return res.status(200).json({ message: "인증번호 확인 성공" });
    } else {
      res.status(400).json({ message: "인증번호가 틀렸습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/email-newpass", async (req, res) => {
  const { email, verify, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exist." });
    }
    const verified = await Verify.find({
      email: email,
      expireDate: { $gte: new Date() },
      done: false,
    })
      .sort({ expireDate: -1 })
      .limit(1);

    if (!verified) {
      return res
        .status(400)
        .json({ message: "유효시간이 지났거나 이미 변경되었습니다." });
    }

    const obj = verified[0];
    if (obj.verify === verify) {
      obj.done = true;
      obj.save();
      user.password = newPassword;
      user.save();
      return res
        .status(200)
        .json({ password: user.password, message: "비밀번호 변경 성공" });
    } else {
      res.status(400).json({ message: "비밀번호 변경 실패" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/study-time", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const today = new Date().toLocaleDateString();
    const userStudyTime = await StudyTime.findOne({
      _user: userId,
      date: today,
    });
    if (userStudyTime) {
      const time = userStudyTime.studyTime;
      const timeH = Math.floor(time / 3600);
      const timeM = Math.floor((time % 3600) / 60);
      return res.status(200).json({
        timeH: timeH,
        timeM: timeM,
        message: `${time}공부 시간 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/goal-time", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { hour, min } = req.body;
  try {
    const time = hour * 3600 + min * 60;
    const existingGoalTime = await GoalTime.findOne({ _user: userId });
    if (existingGoalTime) {
      existingGoalTime.goalTime = time;
      await existingGoalTime.save();
      return res.status(200).json({ message: "GoalTime updated successfully" });
    } else {
      const newGoalTime = new GoalTime({
        _user: userId,
        goalTime: time,
      });
      await newGoalTime.save();
      return res.status(200).json({ message: "GoalTime created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/ggoal-time", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const userGoalTime = await GoalTime.findOne({
      _user: userId,
    });
    if (userGoalTime) {
      const time = userGoalTime.goalTime;
      const timeH = Math.floor(time / 3600);
      const timeM = Math.floor((time % 3600) / 60);
      return res.status(200).json({
        goalTimeH: timeH,
        goalTimeM: timeM,
        message: "목표 공부 시간 가져오기 성공",
      });
    } else {
      res.status(400).json({
        message: "목표 공부시간을 설정해주세요.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* app.get("/ranking", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = today.toLocaleDateString();

    const rankTime = await StudyTime.find({ date: yesterday })
      .sort({ studyTime: -1 })
      .limit(10);

    if (rankTime) {
      const result = [];
      for (let i = 0; i < rankTime.length; i++) {
        const time = rankTime[i].studyTime;
        const timeH = Math.floor(time / 3600);
        const timeM = Math.floor((time % 3600) / 60);
        const timeS = time % 60;
        let userName = null;
        try {
          const user = await User.findById(rankTime[i]._user);
          userName = user.name;
        } catch (error) {
          console.log(error);
        }
        result.push({ timeH, timeM, timeS, userName });
      }

      return res.status(200).json({
        rankTime: result,
        message: "공부 시간 랭킹 가져오기 성공",
      });
    } else {
      res.status(400).json({
        message: "공부한 사용자가 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
 */

app.get("/ranking", async (req, res) => {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = today.toLocaleDateString();

    const rankTime = await StudyTime.find({ date: yesterday })
      .sort({ studyTime: -1 })
      .limit(10);

    if (rankTime) {
      const result = [];
      for (let i = 0; i < rankTime.length; i++) {
        const time = rankTime[i].studyTime;
        const timeH = Math.floor(time / 3600);
        const timeM = Math.floor((time % 3600) / 60);
        const timeS = time % 60;
        let userName = null;
        try {
          const user = await User.findById(rankTime[i]._user);
          userName = user.name;
        } catch (error) {
          console.log(error);
        }
        result.push({ timeH, timeM, timeS, userName });
      }

      return res.status(200).json({
        rankTime: result,
        message: "공부 시간 랭킹 가져오기 성공",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


//+++++++++++++++++++++++++++++++++++++++++
/// 댓글 작성
app.post("/postreply/:id", async (req, res) => {
  const { reply, isSecret, rwriter, rwriterDate } = req.body;
  const { id } = req.params;

  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const replycounter = await ReplyCounter.findOneAndUpdate({ name: '댓글 수' }, { $inc: { totalReply: 1 } }, { new: true, upsert: true });
  const 총댓글수 = (replycounter.totalReply +1);

  if (!replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newReply = new Reply({
      postId : id,
      _id: 총댓글수 + 1, 
      rwriter : rwriter,
      reply : reply,
      isSecret : isSecret
    });
    await newReply.save();
    console.log(isSecret)
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});


/// 대댓글 작성
app.post("/postr_reply/:postId", async (req, res) => {
  const { r_reply, isRSecret } = req.body;
  const { postId, rid } = req.params;


  const post = await Write.findOne({ _id: postId });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await Reply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await R_ReplyCounter.findOneAndUpdate({ name: '대댓글 수' }, { $inc: { totalR_Reply: 1 } }, { new: true, upsert: true });
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new R_Reply({
      postRId : postId,
      r_replyId : rid,
      r_rid: 총대댓글수 + 1,
      r_reply : r_reply,
      isRSecret : isRSecret
    });
    await newR_Reply.save();
    console.log(isRSecret)
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 질문 글 작성
app.post("/postAsk", async (req, res) => {
  const { title, content } = req.body;

  const counter2 = await Counter2.findOneAndUpdate({ name: '게시물 수' }, { $inc: { totalWrite: 1 } }, { new: true, upsert: true });
  const 총게시물갯수 = (counter2.totalWrite +1);

  if (!counter2) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newAsk = new Ask({
      _id: 총게시물갯수 + 1, 
      title : title,
      content : content,
    });
    await newAsk.save();
    
    return res.status(200).json({ message: `Ask created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 스터디 모집글 작성성
app.post("/postWrite", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { number, period, date, tag, title, content, writer, writeDate } =
    req.body;

  const counter = await Counter.findOneAndUpdate(
    { name: "게시물 수" },
    { $inc: { totalWrite: 1 } },
    { new: true, upsert: true }
  );
  const 총게시물갯수 = counter.totalWrite + 1;

  /*_id: Number(총게시물갯수 + 1), */

  if (!counter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newWrite = new Write({
      _id: 총게시물갯수 + 1,
      _user: userId,
      number: number,
      period: period,
      date: date,
      tag: tag,
      title: title,
      content: content,
      writer: writer,
      writeDate: writeDate,
    });
    await newWrite.save();

    return res.status(200).json({ message: `Write created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.get("/getWrite/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Write.find({ _id: Number(req.params.id) });
    if (result) {
      let sameUser = false;
      if (userId === result[0]._user) sameUser = true;
      return res.status(200).json({
        data: result,
        sameUser: sameUser,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// 댓글 
app.get("/getReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    
    const result = await Reply.find({ postId: req.params.id})

    if (result) {
      console.log(result);
      let sameUsers = false;
      if (userId === result[0]._user) sameUsers = true;
      console.log(req.params.postId);
      return res.status(200).json({
        data: result,
        sameUsers: sameUsers,
        message: ` ${typeof req.params.postId}댓글 가져오기 성공`,
      });
    } 
    else {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});





app.listen(8080, () => {
  console.log("서버가 시작되었습니다.");
});

// -------------------------------------------------------------------------

app.use(express.json());
app.post('/openStudy', async (req, res) => {
  try {
    const { img, title, hashtag, personNum } = req.body;

    const newOpenStudy = new OpenStudy({
      img: img,
      title: title,
      tags: hashtag,
      personNum: personNum
    });

    await newOpenStudy.save();
    res.status(200).json({ message: `OpenStudy created successfully` });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: `err.message` });
  }
});

  app.get("/openStudies", async (req, res) => {
    //const { page, limit } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
  
    const offset = (page - 1) * limit;
  
    try {
      const openStudies = await OpenStudy.find().skip(offset).limit(limit);
      //const totalOpenStudies = openStudies.length;
      //console.log(totalOpenStudies);

      //const currentOpenStudies = await OpenStudy.find().skip(offset).limit(limit);
    
        /* if(openStudies){
          return res.status(200).json({
            openStudies: openStudies,
            message: '오픈스터디 목록 가져오기 성공',
          });
        } */
        if(openStudies.length > 0) {
          return res.status(200).json({ 
            openStudies: openStudies,
            //totalOpenStudies,
            message: '오픈스터디 목록 가져오기 성공',
            success: true, 
            openStudies 
          });
        } else {
          return res.status(404).json({
            message: "데이터가 존재하지 않습니다",
            success: false,
          });
        }
      }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
    });







    app.get("/search", async (req, res) => {
      const option = decodeURIComponent(req.query.selected);
      const value = decodeURIComponent(req.query.value);
    
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
    
      const offset = (page - 1) * limit;
      var openStudiesSearch = [];

      try {
        if(option === 'title') {
          openStudiesSearch = await OpenStudy.find({ title: value }, null, { skip: offset, limit: limit });
        }
        else if(option === 'tags') {
          openStudiesSearch = await OpenStudy.find({ tags: { $in: [value] } }, null, { skip: offset, limit: limit });
        }
    
        if(openStudiesSearch.length > 0) {
          return res.status(200).json({ 
            openStudies: openStudiesSearch,
            //totalOpenStudies,
            message: '검색목록 가져오기 성공',
            success: true
          });
        } else {
          return res.status(404).json({
            message: "데이터가 존재하지 않습니다",
            success: false,
          });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
    })