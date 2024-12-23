


varying vec2 vUv;
uniform sampler2D uTexture;

void main(){

    gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = texture2D(uTexture, vUv);
}