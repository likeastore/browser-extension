XAR=./tools/xar-1.6.1/xar
BUILD_DIR=./build/safari
CERTS_DIR=./tools/certs
DIST_DIR=./dist/safari
EXTENSION=likeastore
$XAR -czf $DIST_DIR/$EXTENSION.safariextz --distribution $BUILD_DIR/$EXTENSION.safariextension
$XAR --sign -f $DIST_DIR/$EXTENSION.safariextz --digestinfo-to-sign digest.dat --sig-size `cat $CERTS_DIR/size.txt` --cert-loc $CERTS_DIR/cert.der --cert-loc $CERTS_DIR/cert01 --cert-loc $CERTS_DIR/cert02
openssl rsautl -sign -inkey $CERTS_DIR/key.pem -in digest.dat -out sig.dat
$XAR --inject-sig sig.dat -f $DIST_DIR/$EXTENSION.safariextz
rm -f sig.dat digest.dat