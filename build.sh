# 팀 레포에서 개인 레포로 코드 복사

#!/bin/sh
cd ../
mkdir output
cp -R ./Chingu-Frontend/* ./output
cp -R ./output ./Chingu-Frontend/

# Git 추적 강제용 더미 파일 생성
echo "배포용 더미 파일입니다." > ./output/.keep

# 디버깅용 출력
echo "📦 output 폴더 내용:"
ls -al output