set JAVA_HOME="c:\tools\java\openlogic-openjdk-17.0.15+6-windows-x64\"

set RAMSCHI_VERSION=1.1.0
set IMAGE_TAG=blaszczyk/ramschi:%RAMSCHI_VERSION%

cd ramschi-ui
call npm run build
cd ..
cd ramschi-server
call gradlew bootJar
call docker build -t %IMAGE_TAG% .
call docker push %IMAGE_TAG%
cd ..
