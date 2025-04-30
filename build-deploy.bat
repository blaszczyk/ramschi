set RAMSCHI_DEPLOY_HOST=pi@heizi.fritz.box
set RAMSCHI_DEPLOY_FOLDER=~/ramschi

cd ramschi-ui
call npm run build
cd ..
set JAVA_HOME="c:\tools\java\openlogic-openjdk-17.0.15+6-windows-x64\"
cd ramschi-server
call gradlew bootJar
cd ..
scp ramschi-server/build/libs/ramschi-server.jar %RAMSCHI_DEPLOY_HOST%:%RAMSCHI_DEPLOY_FOLDER%
ssh %RAMSCHI_DEPLOY_HOST% "sudo tmux kill-session -t 0 && cd %RAMSCHI_DEPLOY_FOLDER% && sudo tmux new -d 'java -jar ramschi-server.jar'"
