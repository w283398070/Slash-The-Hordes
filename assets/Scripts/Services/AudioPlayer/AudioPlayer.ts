import { AudioClip, AudioSource, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioPlayer")
export class AudioPlayer extends Component {
    @property(AudioSource) private soundSource: AudioSource; // 音效音源
    @property(AudioSource) private musicSource: AudioSource; // 音乐音源

    // 初始化方法
    public init(soundVolume: number, musicVolume: number): void {
        this.setSoundVolume(soundVolume);
        this.setMusicVolume(musicVolume);
    }

    // 获取音效音量
    public get SoundVolume(): number {
        return this.soundSource.volume;
    }

    // 获取音乐音量
    public get MusicVolume(): number {
        return this.musicSource.volume;
    }

    // 设置音效音量
    public setSoundVolume(volume: number): void {
        this.soundSource.volume = volume;
    }

    // 设置音乐音量
    public setMusicVolume(volume: number): void {
        this.musicSource.volume = volume;
    }

    // 播放音效
    public playSound(clip: AudioClip): void {
        this.soundSource.playOneShot(clip);
    }

    // 播放音乐
    public playMusic(clip: AudioClip): void {
        this.musicSource.stop();
        this.musicSource.clip = clip;
        this.musicSource.play();
    }
}
